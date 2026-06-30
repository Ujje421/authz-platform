import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { join } from 'path';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTHZ_PACKAGE',
        transport: Transport.GRPC,
        options: {
          package: 'authz',
          protoPath: join(__dirname, '../../proto/authorization.proto'),
          url: process.env.AUTHZ_GRPC_URL || 'localhost:50051',
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
