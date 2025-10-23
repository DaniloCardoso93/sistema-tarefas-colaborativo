import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  @ApiProperty({
    example: '3a66e6a4-17df-4780-aedb',
    description: 'User Id',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    example: 'Name',
    description: 'User name',
  })
  @IsString()
  username: string;
}
