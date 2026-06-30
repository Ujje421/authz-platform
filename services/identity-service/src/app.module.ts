import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Tenant } from './tenant.entity';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.DB_USER || 'authz',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'authz',
      entities: [Tenant, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Tenant, User]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
