import { Module } from '@nestjs/common';
import { ClientProxySmartRanking } from './client-proxy-smartranking.service';

@Module({
  providers: [ClientProxySmartRanking],
  exports: [ClientProxySmartRanking],
})
export class ProxyRMQModule {}
