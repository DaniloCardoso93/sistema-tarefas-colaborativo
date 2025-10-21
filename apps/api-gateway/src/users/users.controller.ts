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

@Controller('/api/users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  @Get(':id')
  async getUserById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    return lastValueFrom(
      this.authClient.send<UserResponseDto>('get_user_by_id', id),
    );
  }
}
