import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { TaskPriority, TaskStatus } from './task-enums';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Implementar feature X',
    description: 'Título da tarefa',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false, example: 'Detalhes da implementação...' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false, enum: TaskStatus, example: 'TODO' })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({ required: false, enum: TaskPriority, example: 'HIGH' })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({ required: false, example: '2025-12-31T00:00:00.000Z' })
  @IsDateString()
  @IsOptional()
  due_date?: Date;

  @ApiProperty({
    required: false,
    type: [String],
    format: 'uuid',
    example: ['uuid-do-usuario-1'],
  })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  assigneeIds?: string[];
}
