import {
  Controller,
  Get,
  Inject,
  Param,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';
import { lastValueFrom } from 'rxjs';
import { UserResponseDto } from './dtos/user-response.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/api/users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  @ApiResponse({
    status: 200,
    description: 'Lista de todos os usuários registrados (sem senha).',
    type: [UserResponseDto],
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async getAllUsers(): Promise<UserResponseDto[]> {
    return lastValueFrom(
      this.authClient.send<UserResponseDto[]>('get_all_users', {}),
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar um usuário específico pelo ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID do Usuário',
    type: 'string',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do usuário.',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado (retornado pelo auth-service).',
  })
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    return lastValueFrom(
      this.authClient.send<UserResponseDto>('get_user_by_id', id),
    );
  }
}
