import { ApiProperty } from '@nestjs/swagger';

export class AuditLogDetailsDto {
  @ApiProperty({ required: false })
  field?: string;
  @ApiProperty({ required: false })
  oldValue?: string;
  @ApiProperty({ required: false })
  newValue?: string;
}

export class AuditLogResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  taskId: string;

  @ApiProperty({ format: 'uuid' })
  userId: string;

  @ApiProperty({ example: 'STATUS_CHANGE' })
  action: string;

  @ApiProperty({ type: AuditLogDetailsDto, nullable: true })
  details: AuditLogDetailsDto;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty({
    example: 'danilo',
    description: 'Nome do usuário que realizou a ação',
  })
  username: string;
}
