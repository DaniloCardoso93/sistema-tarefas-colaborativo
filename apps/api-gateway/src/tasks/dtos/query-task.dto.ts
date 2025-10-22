import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { TaskPriority, TaskStatus } from './task-enums';

export class QueryTaskDto {
  @ApiProperty({
    required: false,
    enum: TaskStatus,
    description: 'Filtrar tarefas por status',
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({
    required: false,
    enum: TaskPriority,
    description: 'Filtrar tarefas por prioridade',
  })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;
}
