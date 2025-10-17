import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class NotificationsController {
  private readonly logger = new Logger(NotificationsController.name);

  @EventPattern('task_created')
  handleTaskCreated(@Payload() data: any) {
    this.logger.log('Received a task_created event!');
    console.log(data);
  }

  @EventPattern('task_updated')
  handleTaskUpdated(@Payload() data: any) {
    this.logger.log('Received a task_updated event!');
    console.log(data);
  }
}
