import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { TaskPriority, TaskStatus } from './entities/task.entity';

interface FindAllTasksPayload {
  userId: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern('create_task')
  create(@Payload() data: CreateTaskDto & { userId: string }) {
    return this.tasksService.create(data);
  }

  @MessagePattern('find_all_tasks')
  findAll(@Payload() data: FindAllTasksPayload) {
    const { userId, status, priority } = data;
    return this.tasksService.findAll(userId, status, priority);
  }

  @MessagePattern('find_one_task')
  findOne(@Payload() id: string) {
    return this.tasksService.findOne(id);
  }

  @MessagePattern('update_task')
  update(@Payload() data: { id: string; updateTaskDto: UpdateTaskDto }) {
    return this.tasksService.update(data.id, data.updateTaskDto);
  }

  @MessagePattern('remove_task')
  remove(@Payload() id: string) {
    return this.tasksService.remove(id);
  }
}
