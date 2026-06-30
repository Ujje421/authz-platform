import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

export interface CheckParams {
  tenantId: string;
  resourceNamespace: string;
  resourceId: string;
  relation: string;
  subjectNamespace: string;
  subjectId: string;
  subjectRelation?: string;
}

@Injectable()
export class GraphService {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async check(params: CheckParams): Promise<boolean> {
    const {
      tenantId,
      resourceNamespace,
      resourceId,
      relation,
      subjectNamespace,
      subjectId,
      subjectRelation
    } = params;

    const query = `
      WITH RECURSIVE search_graph(resource_namespace, resource_id, relation, subject_namespace, subject_id, subject_relation, depth, path) AS (
        -- Base Case: Direct relationships
        SELECT 
          t.resource_namespace, t.resource_id, t.relation, 
          t.subject_namespace, t.subject_id, t.subject_relation,
          1 as depth,
          ARRAY[t.id] as path
        FROM tuples t
        WHERE t.tenant_id = $1
          AND t.resource_namespace = $2
          AND t.resource_id = $3
          AND t.relation = $4

        UNION ALL

        -- Recursive Step: Expand usersets (subject_relation is not null)
        SELECT 
          sg.resource_namespace, sg.resource_id, sg.relation,
          next_t.subject_namespace, next_t.subject_id, next_t.subject_relation,
          sg.depth + 1,
          sg.path || next_t.id
        FROM search_graph sg
        JOIN tuples next_t ON 
          next_t.tenant_id = $1 AND
          next_t.resource_namespace = sg.subject_namespace AND
          next_t.resource_id = sg.subject_id AND
          next_t.relation = sg.subject_relation
        WHERE sg.depth < 10 -- Prevent infinite loops / max depth
          AND NOT next_t.id = ANY(sg.path) -- Cycle detection
      )
      SELECT EXISTS (
        SELECT 1 
        FROM search_graph sg
        WHERE sg.subject_namespace = $5
          AND sg.subject_id = $6
          AND (sg.subject_relation = $7 OR (sg.subject_relation IS NULL AND $7 IS NULL))
      ) as "allowed";
    `;

    const result = await this.dataSource.query(query, [
      tenantId,
      resourceNamespace,
      resourceId,
      relation,
      subjectNamespace,
      subjectId,
      subjectRelation || null,
    ]);

    return result[0]?.allowed || false;
  }
}
