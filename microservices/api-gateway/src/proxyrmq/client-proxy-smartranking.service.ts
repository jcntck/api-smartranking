import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxySmartRanking {
  constructor(private readonly configService: ConfigService) {}

  getClientProxyAdminBackendInstance(): ClientProxy {
    const user = this.configService.get<string>('RMQ_USER');
    const password = this.configService.get<string>('RMQ_PASSWORD');
    const url = this.configService.get<string>('RMQ_URL');

    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${user}:${password}@${url}`],
        queue: 'admin-backend',
      },
    });
  }
}
