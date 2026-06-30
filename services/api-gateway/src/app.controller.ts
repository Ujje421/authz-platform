import { Body, Controller, Delete, Inject, OnModuleInit, Post } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface AuthorizationService {
  check(data: any): Observable<any>;
  writeRelationships(data: any): Observable<any>;
  deleteRelationships(data: any): Observable<any>;
}

@Controller('v1/authz')
export class AppController implements OnModuleInit {
  private authzService: AuthorizationService;

  constructor(@Inject('AUTHZ_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.authzService = this.client.getService<AuthorizationService>('AuthorizationService');
  }

  @Post('check')
  check(@Body() body: any) {
    return this.authzService.check(body);
  }

  @Post('relationships')
  writeRelationships(@Body() body: any) {
    return this.authzService.writeRelationships(body);
  }

  @Delete('relationships')
  deleteRelationships(@Body() body: any) {
    return this.authzService.deleteRelationships(body);
  }
}
