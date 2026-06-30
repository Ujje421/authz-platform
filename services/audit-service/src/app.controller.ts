import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('v1/audit')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async logEvent(
    @Body() body: { tenantId: string; actorId: string; action: string; resourceId: string; details?: any }
  ) {
    await this.appService.logEvent(body.tenantId, body.actorId, body.action, body.resourceId, body.details);
    return { status: 'logged' };
  }

  @Get(':tenantId')
  async getLogs(@Param('tenantId') tenantId: string) {
    return this.appService.getLogs(tenantId);
  }
}
