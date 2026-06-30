import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthorizationController } from './authorization.controller';
import { GraphService } from './graph.service';
import { PermissionCacheService } from './cache.service';
import { Tuple } from './tuple.entity';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.DB_USER || 'authz',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'authz',
      entities: [Tuple],
      synchronize: true, // Use migrations in production
    }),
    TypeOrmModule.forFeature([Tuple]),
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          stores: [createKeyv('redis://localhost:6379')],
        };
      },
    }),
  ],
  controllers: [AuthorizationController],
  providers: [GraphService, PermissionCacheService],
})
export class AppModule {}
