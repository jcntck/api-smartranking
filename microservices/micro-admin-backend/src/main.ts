import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:QTlRNnjC9B6O@44.195.96.87:5672/smartranking'],
      noAc: false,
      queue: 'admin-backend',
    },
  });

  await app.listen();
}
bootstrap();
