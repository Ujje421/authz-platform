import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async logEvent(tenantId: string, actorId: string, action: string, resourceId: string, details?: any): Promise<void> {
    const log = this.auditLogRepository.create({
      tenant_id: tenantId,
      actor_id: actorId,
      action,
      resource_id: resourceId,
      details,
    });
    await this.auditLogRepository.save(log);
  }

  async getLogs(tenantId: string): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { tenant_id: tenantId },
      order: { created_at: 'DESC' },
      take: 100,
    });
  }
}
