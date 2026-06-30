import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsEvent } from './analytics-event.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(AnalyticsEvent)
    private readonly analyticsRepository: Repository<AnalyticsEvent>,
  ) {}

  async recordEvent(tenantId: string, eventType: string): Promise<void> {
    const existing = await this.analyticsRepository.findOne({
      where: { tenant_id: tenantId, event_type: eventType },
    });

    if (existing) {
      existing.count += 1;
      await this.analyticsRepository.save(existing);
    } else {
      const newEvent = this.analyticsRepository.create({
        tenant_id: tenantId,
        event_type: eventType,
        count: 1,
      });
      await this.analyticsRepository.save(newEvent);
    }
  }

  async getMetrics(tenantId: string): Promise<any> {
    const events = await this.analyticsRepository.find({
      where: { tenant_id: tenantId },
    });
    
    return events.reduce((acc, curr) => {
      acc[curr.event_type] = curr.count;
      return acc;
    }, {} as Record<string, number>);
  }
}
