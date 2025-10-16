import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // Este método "escuta" por mensagens com o padrão 'register'
  @MessagePattern('register')
  async handleUserRegister(@Payload() createUserDto: CreateUserDto) {
    console.log('Auth-service received register message:', createUserDto.email);
    return this.usersService.create(createUserDto);
  }

  // Um placeholder para a lógica de login que construiremos depois
  @MessagePattern('login')
  async handleUserLogin(@Payload() data: any) {
    console.log('Auth-service received login message for:', data.email);
    // A lógica real de login virá aqui nos próximos dias
    return { message: 'Login placeholder - success!' };
  }
}
