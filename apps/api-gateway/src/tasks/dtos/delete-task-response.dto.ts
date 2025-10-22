import { ApiProperty } from '@nestjs/swagger';

export class DeleteTaskResponseDto {
  @ApiProperty({ example: true })
  deleted: boolean;
}
