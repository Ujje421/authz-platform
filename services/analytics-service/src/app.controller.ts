import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('v1/analytics')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async recordEvent(@Body() body: { tenantId: string; eventType: string }) {
    await this.appService.recordEvent(body.tenantId, body.eventType);
    return { status: 'recorded' };
  }

  @Get(':tenantId')
  async getMetrics(@Param('tenantId') tenantId: string) {
    return this.appService.getMetrics(tenantId);
  }
}
