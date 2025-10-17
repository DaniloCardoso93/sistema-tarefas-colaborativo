import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
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

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.tasksRepository.create(createTaskDto);
    const savedTask = await this.tasksRepository.save(task);
    this.notificationsClient.emit('task_created', savedTask);
    return savedTask;
  }

  findAll(): Promise<Task[]> {
    return this.tasksRepository.find();
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
    const result = await this.tasksRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
    return { deleted: true };
  }
}
