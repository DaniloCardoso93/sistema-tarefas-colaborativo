import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from 'src/users/dtos/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  /**
   * Valida um usuário comparando a senha enviada com o hash salvo.
   * @param loginDto - Dados de email e senha.
   * @returns O objeto do usuário se a validação for bem-sucedida.
   * @throws UnauthorizedException se o usuário não for encontrado ou a senha estiver incorreta.
   */

  async validateUser(loginDto: LoginDto): Promise<User> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (user && (await bcrypt.compare(loginDto.password, user.password_hash))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  /**
   * Realiza o login, valida o usuário e gera os tokens.
   * @param loginDto - Dados de email e senha.
   * @returns Um objeto com accessToken e refreshToken.
   */
  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);
    return this.generateTokens(user);
  }

  async generateTokens(user: Pick<User, 'id' | 'username'>) {
    const payload = { username: user.username, sub: user.id };

    const accessToken = await this.jwtService.signAsync(payload);

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
