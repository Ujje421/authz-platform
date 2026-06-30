import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index, Unique } from 'typeorm';

@Entity('tuples')
@Unique('UQ_TUPLE', ['tenant_id', 'resource_namespace', 'resource_id', 'relation', 'subject_namespace', 'subject_id', 'subject_relation'])
@Index('IDX_TUPLE_RESOURCE', ['tenant_id', 'resource_namespace', 'resource_id', 'relation'])
@Index('IDX_TUPLE_SUBJECT', ['tenant_id', 'subject_namespace', 'subject_id', 'subject_relation'])
export class Tuple {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  tenant_id: string;

  @Column({ type: 'varchar', length: 100 })
  resource_namespace: string;

  @Column({ type: 'varchar', length: 100 })
  resource_id: string;

  @Column({ type: 'varchar', length: 50 })
  relation: string;

  @Column({ type: 'varchar', length: 100 })
  subject_namespace: string;

  @Column({ type: 'varchar', length: 100 })
  subject_id: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  subject_relation: string | null;

  @CreateDateColumn()
  created_at: Date;
}
