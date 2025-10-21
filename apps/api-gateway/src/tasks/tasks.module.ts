import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { ClientsModule } from '@nestjs/microservices';
import { CommentsController } from './comments.controller';

@Module({
  imports: [ClientsModule],
  controllers: [TasksController, CommentsController],
})
export class TasksModule {}
