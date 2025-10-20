import { IsEnum, IsOptional } from 'class-validator';
import { TaskPriority, TaskStatus } from './task-enums';

export class QueryTaskDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;
}
