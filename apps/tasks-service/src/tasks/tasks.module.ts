import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { Comment } from './entities/comment.entity';
import { AuditLog } from './entities/audit-log.entity';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Comment, AuditLog])],
  providers: [TasksService, CommentsService],
  exports: [TasksService, CommentsService],
})
export class TasksModule {}
