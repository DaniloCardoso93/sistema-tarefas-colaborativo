import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dtos/create-comment.dto';

@Controller()
export class CommentsController {
  private readonly logger = new Logger(CommentsController.name);

  constructor(private readonly commentsService: CommentsService) {}

  @MessagePattern('create_comment')
  async handleCommentCreate(@Payload() createCommentDto: CreateCommentDto) {
    this.logger.log('Received create_comment message');
    return this.commentsService.create(createCommentDto);
  }

  @MessagePattern('find_comments_by_task')
  async handleCommentsFindByTask(@Payload() taskId: string) {
    this.logger.log(
      `Received find_comments_by_task message for task: ${taskId}`,
    );
    return this.commentsService.findByTaskId(taskId);
  }
}
