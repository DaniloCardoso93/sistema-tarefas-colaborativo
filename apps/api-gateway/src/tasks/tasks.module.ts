import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule],
  controllers: [TasksController],
})
export class TasksModule {}
