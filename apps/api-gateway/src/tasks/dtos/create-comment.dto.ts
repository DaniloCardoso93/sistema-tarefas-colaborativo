import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'Ótima ideia! Vamos começar por aqui.',
    description: 'O conteúdo textual do comentário.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
