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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

interface RequestWithUser extends Request {
  user: UserFromJwt;
}
@ApiTags('Comments')
@ApiBearerAuth()
@Controller('/api/tasks/:taskId/comments')
@UseGuards(AuthGuard('jwt'))
export class CommentsController {
  constructor(
    @Inject('TASKS_SERVICE') private readonly tasksClient: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar um comentário a uma tarefa' })
  @ApiParam({
    name: 'taskId',
    description: 'UUID da Tarefa',
    type: 'string',
    format: 'uuid',
  })
  @ApiBody({ type: CreateCommentDto })
  @ApiResponse({
    status: 201,
    description: 'Comentário criado com sucesso.',
    type: CommentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Dados de entrada inválidos.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada.' })
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
  @ApiOperation({ summary: 'Listar todos os comentários de uma tarefa' })
  @ApiParam({
    name: 'taskId',
    description: 'UUID da Tarefa',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de comentários.',
    type: [CommentResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Tarefa não encontrada.' })
  async findAllByTask(
    @Param('taskId', ParseUUIDPipe) taskId: string,
  ): Promise<CommentResponseDto> {
    return lastValueFrom(
      this.tasksClient.send('find_comments_by_task', taskId),
    );
  }
}
