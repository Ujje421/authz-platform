import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('v1/identity')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('tenants')
  async createTenant(@Body() body: { name: string }) {
    return this.appService.createTenant(body.name);
  }

  @Post('users')
  async createUser(@Body() body: { email: string; passwordHash: string; tenantId: string }) {
    return this.appService.createUser(body.email, body.passwordHash, body.tenantId);
  }
}
