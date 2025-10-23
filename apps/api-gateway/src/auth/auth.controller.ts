import {
  Controller,
  Post,
  Body,
  Inject,
  OnModuleInit,
  ValidationPipe,
  Logger,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { UserResponseDto } from './dtos/user-response.dto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { NewAccessTokenDto } from './dtos/new-access-token.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request as Req } from 'express';
import { UserFromJwt } from 'src/auth/strategies/jwt.strategy';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProfileDto } from './dtos/profile-user.dto';

interface RequestWithUser extends Req {
  user: UserFromJwt;
}
@ApiTags('Auth')
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
  @ApiOperation({ summary: 'Registrar novo usuário' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'Username or email already exists.',
  })
  async register(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<UserResponseDto> {
    return await lastValueFrom(
      this.authClient.send<UserResponseDto>('register', createUserDto),
    );
  }

  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário e obter token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Authentication successful.',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body(new ValidationPipe()) loginDto: LoginDto) {
    return await lastValueFrom(
      this.authClient.send<LoginResponseDto | { message: string }>(
        'login',
        loginDto,
      ),
    );
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Obtenha um novo token de acesso usando um token de atualização',
  })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'New access token generated.',
    type: NewAccessTokenDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  async refresh(
    @Body(new ValidationPipe()) refreshTokenDto: RefreshTokenDto,
  ): Promise<NewAccessTokenDto> {
    return await lastValueFrom(
      this.authClient.send<NewAccessTokenDto>('refresh_token', refreshTokenDto),
    );
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter perfil de usuário atual' })
  @ApiResponse({
    status: 200,
    description: 'User profile data.',
    type: ProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  getProfile(@Request() req: RequestWithUser) {
    return req.user;
  }
}
