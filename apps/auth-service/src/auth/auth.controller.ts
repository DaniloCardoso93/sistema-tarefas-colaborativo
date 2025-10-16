// apps/auth-service/src/auth/auth.controller.ts
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { LoginDto } from '../users/dtos/login.dto';

@Controller()
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @MessagePattern('register')
  async handleUserRegister(@Payload() createUserDto: CreateUserDto) {
    this.logger.log(`Register attempt for: ${createUserDto.email}`);
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Registration failed for ${createUserDto.email}: ${error.message}`,
        );
      } else {
        this.logger.error(
          `Registration failed for ${createUserDto.email} with an unknown error.`,
        );
      }
      throw error;
    }
  }

  @MessagePattern('login')
  async handleUserLogin(@Payload() loginDto: LoginDto) {
    this.logger.log(`Login attempt for: ${loginDto.email}`);
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Login failed for ${loginDto.email}: ${error.message}`,
        );
      } else {
        this.logger.error(
          `Login failed for ${loginDto.email} with an unknown error.`,
        );
      }
      throw error;
    }
  }
}
