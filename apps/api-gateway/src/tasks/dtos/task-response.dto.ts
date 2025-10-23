import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from './task-enums';
import { AssigneeResponseDto } from './assignee-response.dto';

export class TaskResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ required: false, nullable: true })
  description: string;

  @ApiProperty({ enum: TaskStatus, example: 'TODO' })
  status: TaskStatus;

  @ApiProperty({ enum: TaskPriority, example: 'MEDIUM' })
  priority: TaskPriority;

  @ApiProperty({ required: false, nullable: true })
  due_date: Date;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({
    format: 'uuid',
    description: 'ID do usuário criador da tarefa',
  })
  userId: string;

  @ApiProperty({
    type: [AssigneeResponseDto],
    description: 'Lista de usuários atribuídos',
  })
  assignees: AssigneeResponseDto[];
}
