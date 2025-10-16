import {
  Controller,
  Post,
  Body,
  Inject,
  OnModuleInit,
  ValidationPipe,
  Logger,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { NewAccessTokenDto } from './dtos/new-access-token.dto';

@Controller('/api/auth')
export class AuthController implements OnModuleInit {
  private readonly logger = new Logger(AuthController.name);
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async onModuleInit() {
    try {
      await this.authClient.connect();
      this.logger.log('API Gateway connected to AUTH_SERVICE');
    } catch (err) {
      this.logger.error('Failed to connect to AUTH_SERVICE', err);
    }
  }

  @Post('register')
  async register(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return await lastValueFrom(
      this.authClient.send<UserResponseDto>('register', createUserDto),
    );
  }

  @Post('login')
  async login(@Body(new ValidationPipe()) loginDto: LoginDto) {
    return await lastValueFrom(
      this.authClient.send<LoginResponseDto | { message: string }>(
        'login',
        loginDto,
      ),
    );
  }

  @Post('refresh')
  async refresh(
    @Body(new ValidationPipe()) refreshTokenDto: RefreshTokenDto,
  ): Promise<NewAccessTokenDto> {
    return await lastValueFrom(
      this.authClient.send<NewAccessTokenDto>('refresh_token', refreshTokenDto),
    );
  }
}
