import { Controller, Get } from '@nestjs/common';
import { Consumer, Producer, Reader } from 'pulsar-client';
import { InjectPulsar } from '../../lib';
import { MY_PRODUCER, MY_CONSUMER, MY_READER, MESSAGE } from './constants';


@Controller()
export class AppController {
  constructor(
    @InjectPulsar('producer', MY_PRODUCER)
    private readonly producer: Producer,
    @InjectPulsar('consumer', MY_CONSUMER)
    private readonly consumer: Consumer,
    @InjectPulsar('reader', MY_READER)
    private readonly reader: Reader
  ) { }

  @Get('/pubsub')
  async pubSub() {
    await this.producer.send({
      data: Buffer.from(MESSAGE),
    });

    const [messageFromConsumer, messageFromReader] = await Promise.all([
      this.consumer.receive(),
      this.reader.readNext(),
    ]);

    const fromConsumer = messageFromConsumer.getData().toString();
    const fromReader = messageFromReader.getData().toString();

    await this.consumer.acknowledge(messageFromConsumer);

    await Promise.all([
      this.producer.close(),
      this.consumer.close(),
      this.reader.close(),
    ]);

    return {
      fromConsumer,
      fromReader,
    };
  }
}
