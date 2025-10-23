import { Controller, Logger } from '@nestjs/common';
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

interface UpdateTaskPayload {
  id: string;
  userId: string;
  updateTaskDto: UpdateTaskDto;
}

@Controller()
export class TasksController {
  private readonly logger = new Logger(TasksController.name);
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
  update(@Payload() data: UpdateTaskPayload) {
    return this.tasksService.update(data.id, data.updateTaskDto, data.userId);
  }

  @MessagePattern('remove_task')
  remove(@Payload() id: string) {
    return this.tasksService.remove(id);
  }

  @MessagePattern('find_task_history')
  findHistory(@Payload() taskId: string) {
    this.logger.log(`Received find_task_history message for task: ${taskId}`);
    return this.tasksService.findHistory(taskId);
  }
}
