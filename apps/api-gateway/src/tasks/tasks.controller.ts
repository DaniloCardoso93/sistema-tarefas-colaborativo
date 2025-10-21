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
  Query,
  Logger,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateTaskDto } from './dtos/update-task.dto';
import { UserFromJwt } from '../auth/strategies/jwt.strategy';
import { QueryTaskDto } from './dtos/query-task.dto';

interface RequestWithUser extends Request {
  user: UserFromJwt;
}

type AuditLog = {
  id: string;
  taskId: string;
  userId: string;
  action: string;
  details: any;
  timestamp: Date;
};
type User = { id: string; username: string; email: string };

@Controller('/api/tasks')
export class TasksController {
  private readonly logger = new Logger(TasksController.name);
  constructor(
    @Inject('TASKS_SERVICE') private readonly tasksClient: ClientProxy,
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
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
  findAll(
    @Request() req: RequestWithUser,
    @Query(new ValidationPipe({ transform: true, whitelist: true }))
    query: QueryTaskDto,
  ) {
    const payload = {
      userId: req.user.userId,
      status: query.status,
      priority: query.priority,
    };
    return lastValueFrom(this.tasksClient.send('find_all_tasks', payload));
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return lastValueFrom(this.tasksClient.send('find_one_task', id));
  }

  @Get(':id/history')
  @UseGuards(AuthGuard('jwt'))
  async findTaskHistory(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.log(`Fetching history for task ${id}`);

    const logs = await firstValueFrom(
      this.tasksClient.send<AuditLog[]>('find_task_history', id),
    );

    if (logs.length === 0) {
      return [];
    }

    const userIds = [...new Set(logs.map((log) => log.userId))];

    const userPromises = userIds.map((userId) =>
      firstValueFrom(this.authClient.send<User>('get_user_by_id', userId)),
    );
    const users = await Promise.all(userPromises);

    const userMap = new Map(users.map((user) => [user.id, user.username]));

    const populatedHistory = logs.map((log) => ({
      ...log,
      username: userMap.get(log.userId) || 'Usuário Desconhecido',
    }));

    return populatedHistory;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateTaskDto: UpdateTaskDto,
  ) {
    return lastValueFrom(
      this.tasksClient.send('update_task', {
        id,
        updateTaskDto,
        userId: req.user.userId,
      }),
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return lastValueFrom(this.tasksClient.send('remove_task', id));
  }
}
