import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern('get_user_by_id')
  async handleGetUserById(@Payload() userId: string) {
    return this.usersService.findByIdSafe(userId);
  }

  @MessagePattern('get_all_users')
  async handleGetAllUsers() {
    return this.usersService.findAllSafe();
  }
}
