import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  tenant_id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  actor_id: string;

  @Column({ type: 'varchar', length: 50 })
  action: string;

  @Column({ type: 'varchar', length: 100 })
  resource_id: string;

  @Column({ type: 'jsonb', nullable: true })
  details: any;

  @CreateDateColumn()
  created_at: Date;
}
