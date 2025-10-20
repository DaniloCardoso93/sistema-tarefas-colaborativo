import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationsGateway } from './notifications.gateway';

@Controller()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);
  constructor(private readonly gateway: NotificationsGateway) {}

  @EventPattern('task_created')
  handleTaskCreated(@Payload() data: any) {
    this.logger.log('Received a task_created event, emitting notification...');
    this.gateway.sendNotification('new_task', data);
  }

  @EventPattern('task_updated')
  handleTaskUpdated(@Payload() data: any) {
    this.logger.log('Received a task_updated event, emitting notification...');
    this.gateway.sendNotification('updated_task', data);
  }
}
