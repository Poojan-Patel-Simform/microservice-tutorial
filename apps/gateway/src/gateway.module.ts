import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller.js';
import { GatewayService } from './gateway.service.js';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CATALOG_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL ?? 'amqp://localhost:5672'],
          queue: process.env.CATALOG_QUEUE ?? 'catalog_queue',
          queueOptions: {
            isDurable: true,
          },
        },
      },
    ]),
  ],
  controllers: [GatewayController],
  providers: [GatewayService],
})
export class GatewayModule {}
