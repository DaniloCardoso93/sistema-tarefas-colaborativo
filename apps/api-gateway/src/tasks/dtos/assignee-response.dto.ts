import { ApiProperty } from '@nestjs/swagger';

export class AssigneeResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  taskId: string;

  @ApiProperty({ format: 'uuid' })
  userId: string;
}
