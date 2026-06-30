import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorizationSchema } from './schema.entity';
import * as yaml from 'js-yaml';

@Injectable()
export class SchemaService {
  constructor(
    @InjectRepository(AuthorizationSchema)
    private readonly schemaRepository: Repository<AuthorizationSchema>,
  ) {}

  parseYaml(yamlContent: string): any {
    try {
      const parsed = yaml.load(yamlContent);
      
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Invalid schema format');
      }

      return parsed;
    } catch (e: any) {
      throw new BadRequestException(`YAML Parsing error: ${e.message}`);
    }
  }

  async createSchema(tenantId: string, yamlContent: string): Promise<AuthorizationSchema> {
    const parsed = this.parseYaml(yamlContent);
    
    const latest = await this.schemaRepository.findOne({
      where: { tenant_id: tenantId },
      order: { version: 'DESC' },
    });

    const nextVersion = latest ? latest.version + 1 : 1;

    const schema = this.schemaRepository.create({
      tenant_id: tenantId,
      version: nextVersion,
      definition_yaml: yamlContent,
      parsed_schema: parsed,
    });

    return await this.schemaRepository.save(schema);
  }

  async getLatestSchema(tenantId: string): Promise<AuthorizationSchema | null> {
    return this.schemaRepository.findOne({
      where: { tenant_id: tenantId },
      order: { version: 'DESC' },
    });
  }
}
