import { DEFAULT_CLIENT_NAME } from '../../lib';

export const MY_CLIENT = 'myClient';
export const MY_PRODUCER = 'myProducer';
export const MY_CLIENT_PRODUCER = MY_CLIENT + MY_PRODUCER;
export const MY_CONSUMER = 'myConsumer';
export const MY_CLIENT_CONSUMER = MY_CLIENT + MY_CONSUMER;
export const MY_READER = 'myReader';
export const MY_CLIENT_READER = MY_CLIENT + MY_READER;
export const MY_TOPIC = 'myTopic';
export const MY_CLIENT_TOPIC = MY_CLIENT + MY_TOPIC;
export const MY_SUBSCRIPTION = 'mySubscription';
export const MY_CLIENT_SUBSCRIPTION = MY_CLIENT + MY_SUBSCRIPTION;
export const MESSAGE = 'Hello, Pulsar';
export const MY_CLIENT_MESSAGE = 'Hello, Pulsar from myClient';
export const PUBSUB_RESPONSE = {
  fromConsumer: MESSAGE,
  fromReader: MESSAGE,
};
const MY_CLIENT_PUBSUB_RESPONSE = {
  fromConsumer: MY_CLIENT_MESSAGE,
  fromReader: MY_CLIENT_MESSAGE,
};
export const MULTIPLE_PUBSUB_RESPONSE = {
  [DEFAULT_CLIENT_NAME]: PUBSUB_RESPONSE,
  [MY_CLIENT]: MY_CLIENT_PUBSUB_RESPONSE,
};
