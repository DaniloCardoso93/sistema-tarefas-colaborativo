import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'SEU_SEGREDO_SUPER_SECRETO_DO_ACCESS_TOKEN', // NAO ESQUECER DE MOVER PARA .ENV
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
