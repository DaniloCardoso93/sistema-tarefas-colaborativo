import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateTokens(user: Pick<User, 'id' | 'username'>) {
    const payload = { username: user.username, sub: user.id };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: 'SEU_SEGREDO_SUPER_SECRETO_DO_REFRESH_TOKEN', // NAO ESQUECER DE MOVER PARA .ENV
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
