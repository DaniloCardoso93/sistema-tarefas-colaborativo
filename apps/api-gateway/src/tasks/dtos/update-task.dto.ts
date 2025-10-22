import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    description:
      'Qualquer campo do CreateTaskDto pode ser enviado parcialmente.',
  })
  _example?: string;
}
