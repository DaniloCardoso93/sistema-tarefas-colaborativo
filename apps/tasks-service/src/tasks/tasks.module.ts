import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { Comment } from './entities/comment.entity';
import { AuditLog } from './entities/audit-log.entity';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TaskAssignee } from './entities/task-assignee.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Comment, AuditLog, TaskAssignee]),
    ClientsModule.registerAsync([
      {
        name: 'NOTIFICATIONS_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.get<string>('RABBITMQ_URL')!],
            queue: 'notifications_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [TasksController, CommentsController],
  providers: [TasksService, CommentsService],
  exports: [TasksService, CommentsService],
})
export class TasksModule {}
