import { Injectable } from '@nestjs/common';
import { MY_PRODUCER, MY_CONSUMER, MY_READER, MY_TOPIC, MY_SUBSCRIPTION } from '../src/constants';


@Injectable()
export class ConfigService {
  serviceUrl = 'pulsar://localhost:6650';
  producerName = MY_PRODUCER;
  consumerName = MY_CONSUMER;
  readerName = MY_READER;
  topicName = MY_TOPIC;
  subscriptionName = MY_SUBSCRIPTION;
}
