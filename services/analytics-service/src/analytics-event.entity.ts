import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('analytics_events')
export class AnalyticsEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  tenant_id: string;

  @Column({ type: 'varchar', length: 100 })
  event_type: string;

  @Column({ type: 'integer', default: 1 })
  count: number;

  @CreateDateColumn()
  timestamp: Date;
}
