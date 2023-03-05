import { Module } from '@nestjs/common';
import { MessageId } from 'pulsar-client';
import { PulsarModule } from '../../lib';
import { MY_PRODUCER, MY_CONSUMER, MY_READER, MY_TOPIC, MY_SUBSCRIPTION, MY_CLIENT } from '../src/constants';
import { AppController } from './app.controller';


@Module({
  imports: [
    PulsarModule.forRoot(
      {
        serviceUrl: 'pulsar://localhost:6650',
      },
      MY_CLIENT
    ),
    PulsarModule.forFeature(
      'producer',
      MY_PRODUCER,
      {
        topic: MY_TOPIC,
      },
      MY_CLIENT
    ),
    PulsarModule.forFeature(
      'consumer',
      MY_CONSUMER,
      {
        subscription: MY_SUBSCRIPTION,
        topic: MY_TOPIC,
      },
      MY_CLIENT
    ),
    PulsarModule.forFeature(
      'reader',
      MY_READER,
      {
        topic: MY_TOPIC,
        startMessageId: MessageId.latest(),
      },
      MY_CLIENT
    ),
  ],
  controllers: [AppController],
})
export class NamedClientAppModule {
}
