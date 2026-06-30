import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { GraphService } from './graph.service';
import { PermissionCacheService } from './cache.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Tuple } from './tuple.entity';

@Controller()
export class AuthorizationController {
  constructor(
    private readonly graphService: GraphService,
    private readonly cacheService: PermissionCacheService,
    @InjectDataSource() private readonly dataSource: DataSource,
  ) {}

  @GrpcMethod('AuthorizationService', 'Check')
  async check(data: any): Promise<{ allowed: boolean; consistency_token: string }> {
    const { resource, relation, subject, consistency_token } = data;
    
    const params = {
      tenantId: 'default-tenant',
      resourceNamespace: resource.namespace,
      resourceId: resource.object_id,
      relation,
      subjectNamespace: subject.namespace,
      subjectId: subject.object_id,
      subjectRelation: subject.relation || undefined,
    };

    if (consistency_token === 'at_least_as_fresh' || !consistency_token) {
      const cachedResult = await this.cacheService.get(params);
      if (cachedResult !== null) {
        return { allowed: cachedResult, consistency_token: Date.now().toString() };
      }
    }

    const allowed = await this.graphService.check(params);
    
    await this.cacheService.set(params, allowed);
    
    return { allowed, consistency_token: Date.now().toString() };
  }

  @GrpcMethod('AuthorizationService', 'WriteRelationships')
  async writeRelationships(data: any): Promise<{ consistency_token: string }> {
    const { relationships } = data;
    const queryRunner = this.dataSource.createQueryRunner();
    
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      for (const rel of relationships) {
        const tuple = new Tuple();
        tuple.tenant_id = 'default-tenant';
        tuple.resource_namespace = rel.resource.namespace;
        tuple.resource_id = rel.resource.object_id;
        tuple.relation = rel.relation;
        tuple.subject_namespace = rel.subject.namespace;
        tuple.subject_id = rel.subject.object_id;
        tuple.subject_relation = rel.subject.relation || null;
        
        await queryRunner.manager.save(tuple);
        await this.cacheService.invalidate('default-tenant', rel.resource.namespace, rel.resource.object_id);
      }
      
      await queryRunner.commitTransaction();
      return { consistency_token: Date.now().toString() };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}
