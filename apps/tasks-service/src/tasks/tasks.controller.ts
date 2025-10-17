import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Controller()
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @MessagePattern('create_task')
  create(@Payload() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @MessagePattern('find_all_tasks')
  findAll() {
    return this.tasksService.findAll();
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
