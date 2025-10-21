import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Task, TaskPriority, TaskStatus } from './entities/task.entity';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { AuditLog } from './entities/audit-log.entity';
import { TaskAssignee } from './entities/task-assignee.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @InjectRepository(AuditLog)
    private auditLogRepository: Repository<AuditLog>,
    @InjectRepository(TaskAssignee)
    private assigneesRepository: Repository<TaskAssignee>,
    @Inject('NOTIFICATIONS_SERVICE')
    private notificationsClient: ClientProxy,
  ) {}

  async create(
    createTaskPayload: CreateTaskDto & { userId: string },
  ): Promise<Task> {
    const { assigneeIds, ...taskData } = createTaskPayload;
    const task = this.tasksRepository.create(taskData);
    const savedTask = await this.tasksRepository.save(task);
    if (assigneeIds && assigneeIds.length > 0) {
      const assignees = assigneeIds.map((userId) =>
        this.assigneesRepository.create({
          taskId: savedTask.id,
          userId: userId,
        }),
      );
      await this.assigneesRepository.save(assignees);
    }
    this.notificationsClient.emit('task_created', savedTask);
    return this.findOne(savedTask.id);
  }

  findAll(
    userId: string,
    status?: TaskStatus,
    priority?: TaskPriority,
  ): Promise<Task[]> {
    const whereOptions: FindManyOptions<Task>['where'] = {
      userId: userId,
    };
    if (status) {
      whereOptions.status = status;
    }
    if (priority) {
      whereOptions.priority = priority;
    }
    return this.tasksRepository.find({
      where: whereOptions,
      order: {
        created_at: 'DESC',
      },
      relations: {
        assignees: true,
      },
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: {
        assignees: true,
        comments: true,
        auditLogs: true,
      },
    });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const oldTask = await this.findOne(id);
    const task = await this.tasksRepository.preload({
      id,
      ...updateTaskDto,
    });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    const updatedTask = await this.tasksRepository.save(task);
    await this.createAuditLogs(oldTask, updatedTask, userId);
    this.notificationsClient.emit('task_updated', updatedTask);
    return updatedTask;
  }

  private async createAuditLogs(oldTask: Task, newTask: Task, userId: string) {
    const logs: AuditLog[] = [];
    if (oldTask.status !== newTask.status) {
      logs.push(
        this.auditLogRepository.create({
          taskId: newTask.id,
          userId: userId,
          action: 'STATUS_CHANGE',
          details: { oldValue: oldTask.status, newValue: newTask.status },
        }),
      );
    }
    if (oldTask.priority !== newTask.priority) {
      logs.push(
        this.auditLogRepository.create({
          taskId: newTask.id,
          userId: userId,
          action: 'PRIORITY_CHANGE',
          details: { oldValue: oldTask.priority, newValue: newTask.priority },
        }),
      );
    }
    if (logs.length > 0) {
      await this.auditLogRepository.save(logs);
    }
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const task = await this.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    console.log(task);
    await this.tasksRepository.delete(id);
    this.notificationsClient.emit('task_deleted', {
      id: task.id,
      userId: task.userId,
    });

    return { deleted: true };
  }

  async findHistory(taskId: string): Promise<AuditLog[]> {
    await this.findOne(taskId);

    return this.auditLogRepository.find({
      where: { taskId },
      order: {
        timestamp: 'DESC',
      },
    });
  }
}
