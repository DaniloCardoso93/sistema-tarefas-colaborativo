import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Task, TaskPriority, TaskStatus } from './entities/task.entity';
import { ClientProxy } from '@nestjs/microservices';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    @Inject('NOTIFICATIONS_SERVICE')
    private notificationsClient: ClientProxy,
  ) {}

  async create(
    createTaskPayload: CreateTaskDto & { userId: string },
  ): Promise<Task> {
    const task = this.tasksRepository.create(createTaskPayload);
    const savedTask = await this.tasksRepository.save(task);
    this.notificationsClient.emit('task_created', savedTask);
    return savedTask;
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
    });
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.tasksRepository.preload({
      id,
      ...updateTaskDto,
    });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    const updatedTask = await this.tasksRepository.save(task);
    this.notificationsClient.emit('task_updated', updatedTask);
    return updatedTask;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const task = await this.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    await this.tasksRepository.delete(id);
    this.notificationsClient.emit('task_deleted', {
      id: task.id,
      userId: task.userId,
    });

    return { deleted: true };
  }
}
