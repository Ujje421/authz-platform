import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('authorization_schemas')
export class AuthorizationSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  tenant_id: string;

  @Column({ type: 'integer' })
  version: number;

  @Column({ type: 'text' })
  definition_yaml: string;

  @Column({ type: 'jsonb' })
  parsed_schema: any;

  @CreateDateColumn()
  created_at: Date;
}
