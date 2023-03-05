import { Controller, Get } from '@nestjs/common';
import { Consumer, Producer, Reader } from 'pulsar-client';
import { InjectPulsar } from '../../lib';
import { MY_PRODUCER, MY_CONSUMER, MY_READER, MESSAGE, MY_CLIENT_PRODUCER, MY_CLIENT_CONSUMER, MY_CLIENT_READER, MY_CLIENT_MESSAGE, MULTIPLE_PUBSUB_RESPONSE } from '../src/constants';


@Controller()
export class MultipleClientsAppController {
  constructor(
    @InjectPulsar('producer', MY_PRODUCER)
    private readonly defaultProducer: Producer,
    @InjectPulsar('consumer', MY_CONSUMER)
    private readonly defaultConsumer: Consumer,
    @InjectPulsar('reader', MY_READER)
    private readonly defaultReader: Reader,
    @InjectPulsar('producer', MY_CLIENT_PRODUCER)
    private readonly myClientProducer: Producer,
    @InjectPulsar('consumer', MY_CLIENT_CONSUMER)
    private readonly myClientConsumer: Consumer,
    @InjectPulsar('reader', MY_CLIENT_READER)
    private readonly myClientReader: Reader
  ) { }

  private async defaultPubSub() {
    await this.defaultProducer.send({
      data: Buffer.from(MESSAGE),
    });

    const [messageFromConsumer, messageFromReader] = await Promise.all([
      this.defaultConsumer.receive(),
      this.defaultReader.readNext(),
    ]);

    const fromConsumer = messageFromConsumer.getData().toString();
    const fromReader = messageFromReader.getData().toString();

    await this.defaultConsumer.acknowledge(messageFromConsumer);

    await Promise.all([
      this.defaultProducer.close(),
      this.defaultConsumer.close(),
      this.defaultReader.close(),
    ]);

    return {
      fromConsumer,
      fromReader,
    };
  }

  private async myClientPubSub() {
    await this.myClientProducer.send({
      data: Buffer.from(MY_CLIENT_MESSAGE),
    });

    const [messageFromConsumer, messageFromReader] = await Promise.all([
      this.myClientConsumer.receive(),
      this.myClientReader.readNext(),
    ]);

    const fromConsumer = messageFromConsumer.getData().toString();
    const fromReader = messageFromReader.getData().toString();

    await this.myClientConsumer.acknowledge(messageFromConsumer);

    await Promise.all([
      this.myClientProducer.close(),
      this.myClientConsumer.close(),
      this.myClientReader.close(),
    ]);

    return {
      fromConsumer,
      fromReader,
    };
  }

  @Get('/pubsub')
  async pubSub(): Promise<typeof MULTIPLE_PUBSUB_RESPONSE> {
    const [defaultPubSub, myClientPubSub] = await Promise.all([
      this.defaultPubSub(),
      this.myClientPubSub(),
    ]);

    return {
      default: defaultPubSub,
      myClient: myClientPubSub,
    };
  }
}
