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
  Request,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { UserFromJwt } from '../auth/strategies/jwt.strategy';

interface RequestWithUser extends Request {
  user: UserFromJwt;
}

@Controller('/api/tasks')
export class TasksController {
  constructor(
    @Inject('TASKS_SERVICE') private readonly tasksClient: ClientProxy,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Request() req: RequestWithUser,
    @Body(new ValidationPipe()) createTaskDto: CreateTaskDto,
  ) {
    const payload = {
      ...createTaskDto,
      userId: req.user.userId,
    };
    return lastValueFrom(this.tasksClient.send('create_task', payload));
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Request() req: RequestWithUser) {
    return lastValueFrom(
      this.tasksClient.send('find_all_tasks', { userId: req.user.userId }),
    );
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
