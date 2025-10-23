import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Task } from './task.entity';

@Entity({ name: 'audit_logs' })
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  taskId: string;

  @Column()
  userId: string;

  @Column()
  action: string;

  @Column({ type: 'jsonb', nullable: true })
  details: {
    field?: string;
    oldValue?: string;
    newValue?: string;
  };

  @ManyToOne(() => Task, (task) => task.auditLogs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'taskId' })
  task: Task;

  @CreateDateColumn()
  timestamp: Date;
}
