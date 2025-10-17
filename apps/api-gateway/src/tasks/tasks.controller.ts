import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';

@Controller('/api/tasks')
export class TasksController {
  constructor(
    @Inject('TASKS_SERVICE') private readonly tasksClient: ClientProxy,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body(new ValidationPipe()) createTaskDto: CreateTaskDto) {
    return lastValueFrom(this.tasksClient.send('create_task', createTaskDto));
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return lastValueFrom(this.tasksClient.send('find_all_tasks', {}));
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return lastValueFrom(this.tasksClient.send('find_one_task', id));
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateTaskDto: UpdateTaskDto,
  ) {
    return lastValueFrom(
      this.tasksClient.send('update_task', { id, updateTaskDto }),
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return lastValueFrom(this.tasksClient.send('remove_task', id));
  }
}
