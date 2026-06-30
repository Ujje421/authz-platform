import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { SchemaService } from './schema.service';
import { AuthorizationSchema } from './schema.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: 5432,
      username: process.env.DB_USER || 'authz',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'authz',
      entities: [AuthorizationSchema],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([AuthorizationSchema]),
  ],
  controllers: [AppController],
  providers: [SchemaService],
})
export class AppModule {}
