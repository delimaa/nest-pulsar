import { Module } from '@nestjs/common';
import { MessageId } from 'pulsar-client';
import { PulsarModule } from '../../lib';
import { MY_PRODUCER, MY_CONSUMER, MY_READER } from '../src/constants';
import { ConfigService } from './config.service';
import { ConfigModule } from './config.module';
import { AppController } from './app.controller';


@Module({
  imports: [
    PulsarModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        serviceUrl: config.serviceUrl,
      }),
    }),
    PulsarModule.forFeatureAsync('producer', MY_PRODUCER, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        topic: config.topicName,
      }),
    }),
    PulsarModule.forFeatureAsync('consumer', MY_CONSUMER, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        subscription: config.subscriptionName,
        topic: config.topicName,
      }),
    }),
    PulsarModule.forFeatureAsync('reader', MY_READER, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        topic: config.topicName,
        startMessageId: MessageId.latest(),
      }),
    }),
  ],
  controllers: [AppController],
})
export class AsyncAppModule {
}
