import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Task } from './entities/task.entity';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
  ) {}

  async create(createCommentDto: CreateCommentDto): Promise<Comment> {
    const task = await this.tasksRepository.findOne({
      where: { id: createCommentDto.taskId },
    });

    if (!task) {
      throw new NotFoundException(
        `Task with ID "${createCommentDto.taskId}" not found`,
      );
    }

    const newComment = this.commentsRepository.create(createCommentDto);
    const savedComment = await this.commentsRepository.save(newComment);
    const auditLog = this.auditLogRepository.create({
      taskId: savedComment.taskId,
      userId: savedComment.userId,
      action: 'COMMENT_ADDED',
      details: { newValue: savedComment.content.substring(0, 50) + '...' },
    });
    await this.auditLogRepository.save(auditLog);
    return this.commentsRepository.save(newComment);
  }

  async findByTaskId(taskId: string): Promise<Comment[]> {
    const task = await this.tasksRepository.findOne({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${taskId}" not found`);
    }

    return this.commentsRepository.find({ where: { taskId } });
  }
}
