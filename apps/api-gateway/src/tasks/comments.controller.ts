import {
  Controller,
  Post,
  Body,
  Get,
  Inject,
  Param,
  UseGuards,
  ValidationPipe,
  Request,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { UserFromJwt } from '../auth/strategies/jwt.strategy';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CommentResponseDto } from './dtos/comment-response.dto';

interface RequestWithUser extends Request {
  user: UserFromJwt;
}

@Controller('/api/tasks/:taskId/comments')
@UseGuards(AuthGuard('jwt'))
export class CommentsController {
  constructor(
    @Inject('TASKS_SERVICE') private readonly tasksClient: ClientProxy,
  ) {}

  @Post()
  async create(
    @Param('taskId', ParseUUIDPipe) taskId: string,
    @Body(new ValidationPipe()) createCommentDto: CreateCommentDto,
    @Request() req: RequestWithUser,
  ): Promise<CommentResponseDto> {
    const payload = {
      ...createCommentDto,
      taskId,
      userId: req.user.userId,
    };
    return lastValueFrom(this.tasksClient.send('create_comment', payload));
  }

  @Get()
  async findAllByTask(
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ): Promise<CommentResponseDto> {
    return lastValueFrom(
      this.tasksClient.send('find_comments_by_task', taskId),
    );
  }
}
