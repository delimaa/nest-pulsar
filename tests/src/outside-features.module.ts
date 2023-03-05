import { Module } from '@nestjs/common';
import { MessageId } from 'pulsar-client';
import { PulsarModule } from '../../lib';
import {
  MY_PRODUCER,
  MY_CONSUMER,
  MY_READER,
  MY_TOPIC,
  MY_SUBSCRIPTION,
} from '../src/constants';

@Module({
  imports: [
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
  ],
  exports: [PulsarModule],
})
export class OutsideFeaturesModule {}
