import { NestFactory } from '@nestjs/core';
import { SearchModule } from './search.module.js';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  process.title = 'search';
  const logger = new Logger('SearchBootstrap');
  const rmqURL = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';
  const searchQueue = process.env.SEARCH_QUEUE ?? 'search_queue';

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SearchModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rmqURL],
        queue: searchQueue,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  app.enableShutdownHooks();
  await app.listen();

  logger.log(`Search RMQ listing on queue ${searchQueue} via ${rmqURL}`);
}
await bootstrap();
