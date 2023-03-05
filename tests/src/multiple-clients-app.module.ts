import { Module } from '@nestjs/common';
import { MessageId } from 'pulsar-client';
import { PulsarModule } from '../../lib';
import { MY_PRODUCER, MY_CONSUMER, MY_READER, MY_TOPIC, MY_SUBSCRIPTION, MY_CLIENT_PRODUCER, MY_CLIENT_CONSUMER, MY_CLIENT_READER, MY_CLIENT, MY_CLIENT_TOPIC, MY_CLIENT_SUBSCRIPTION } from '../src/constants';
import { MultipleClientsAppController } from './multiple-clients-app.controller';


@Module({
  imports: [
    PulsarModule.forRoot({
      serviceUrl: 'pulsar://localhost:6650',
    }),
    PulsarModule.forFeature('producer', MY_PRODUCER, {
      topic: MY_TOPIC,
    }),
    PulsarModule.forFeature('consumer', MY_CONSUMER, {
      subscription: MY_SUBSCRIPTION,
      topic: MY_TOPIC,
    }),
    PulsarModule.forFeature('reader', MY_READER, {
      topic: MY_TOPIC,
      startMessageId: MessageId.latest(),
    }),
    PulsarModule.forRoot(
      {
        serviceUrl: 'pulsar://localhost:6650',
      },
      MY_CLIENT
    ),
    PulsarModule.forFeature(
      'producer',
      MY_CLIENT_PRODUCER,
      {
        topic: MY_CLIENT_TOPIC,
      },
      MY_CLIENT
    ),
    PulsarModule.forFeature(
      'consumer',
      MY_CLIENT_CONSUMER,
      {
        subscription: MY_CLIENT_SUBSCRIPTION,
        topic: MY_CLIENT_TOPIC,
      },
      MY_CLIENT
    ),
    PulsarModule.forFeature(
      'reader',
      MY_CLIENT_READER,
      {
        topic: MY_CLIENT_TOPIC,
        startMessageId: MessageId.latest(),
      },
      MY_CLIENT
    ),
  ],
  controllers: [MultipleClientsAppController],
})
export class MultipleClientsAppModule {
}
