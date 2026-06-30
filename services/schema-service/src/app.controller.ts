import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SchemaService } from './schema.service';

@Controller('v1/schemas')
export class AppController {
  constructor(private readonly schemaService: SchemaService) {}

  @Post()
  async createSchema(@Body() body: { tenantId: string; schema: string }) {
    const result = await this.schemaService.createSchema(body.tenantId, body.schema);
    return {
      id: result.id,
      version: result.version,
      status: 'created',
    };
  }

  @Get(':tenantId/latest')
  async getLatestSchema(@Param('tenantId') tenantId: string) {
    const schema = await this.schemaService.getLatestSchema(tenantId);
    if (!schema) {
      return { message: 'No schema found' };
    }
    return schema;
  }
}
