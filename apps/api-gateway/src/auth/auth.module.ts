// apps/api-gateway/src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const rmqUrl = configService.get<string>('RABBITMQ_URL');
          if (!rmqUrl) {
            throw new Error(
              'FATAL ERROR: RABBITMQ_URL is not defined in the environment variables.',
            );
          }
          return {
            transport: Transport.RMQ,
            options: {
              urls: [rmqUrl],
              queue: 'auth_queue',
              queueOptions: {
                durable: false,
              },
            },
          };
        },
      },
    ]),
  ],
  controllers: [AuthController],
})
export class AuthModule {}
