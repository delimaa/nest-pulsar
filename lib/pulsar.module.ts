import { DynamicModule, FactoryProvider, Module } from '@nestjs/common';
import {
  Client,
  ClientConfig,
  Consumer,
  ConsumerConfig,
  Producer,
  ProducerConfig,
  Reader,
  ReaderConfig,
} from 'pulsar-client';
import { PulsarCoreModule } from './pulsar-core.module';
import {
  getClientToken,
  getFeatureConfigToken,
  getFeatureToken,
} from './pulsar.utils';

@Module({})
export class PulsarModule {
  static forRoot(config: ClientConfig, clientName?: string): DynamicModule {
    return {
      module: PulsarModule,
      imports: [PulsarCoreModule.forRoot(config, clientName)],
    };
  }

  static forRootAsync(
    options: Pick<FactoryProvider<ClientConfig>, 'inject' | 'useFactory'> &
      Pick<DynamicModule, 'imports'>,
    clientName?: string,
  ): DynamicModule {
    return {
      module: PulsarModule,
      imports: [PulsarCoreModule.forRootAsync(options, clientName)],
    };
  }

  static forFeature(
    type: 'consumer',
    name: string,
    config: ConsumerConfig,
    clientName?: string,
  ): DynamicModule;
  static forFeature(
    type: 'producer',
    name: string,
    config: ProducerConfig,
    clientName?: string,
  ): DynamicModule;
  static forFeature(
    type: 'reader',
    name: string,
    config: ReaderConfig,
    clientName?: string,
  ): DynamicModule;
  static forFeature(
    type: 'consumer' | 'producer' | 'reader',
    name: string,
    config: ConsumerConfig | ProducerConfig | ReaderConfig,
    clientName?: string,
  ): DynamicModule {
    const clientToken = getClientToken(clientName);
    const featureToken = getFeatureToken(type, name);

    const featureProvider: FactoryProvider<Consumer | Producer | Reader> = {
      provide: featureToken,
      inject: [clientToken],
      useFactory: (client: Client) => {
        if (type === 'consumer')
          return client.subscribe(config as ConsumerConfig);
        if (type === 'producer')
          return client.createProducer(config as ProducerConfig);
        if (type === 'reader')
          return client.createReader(config as ReaderConfig);
        throw new Error('Invalid feature type');
      },
    };

    return {
      module: PulsarModule,
      providers: [featureProvider],
      exports: [featureProvider],
    };
  }

  static forFeatureAsync(
    type: 'consumer',
    name: string,
    options: Pick<FactoryProvider<ConsumerConfig>, 'inject' | 'useFactory'> &
      Pick<DynamicModule, 'imports'>,
    clientName?: string,
  ): DynamicModule;
  static forFeatureAsync(
    type: 'producer',
    name: string,
    options: Pick<FactoryProvider<ProducerConfig>, 'inject' | 'useFactory'> &
      Pick<DynamicModule, 'imports'>,
    clientName?: string,
  ): DynamicModule;
  static forFeatureAsync(
    type: 'reader',
    name: string,
    options: Pick<FactoryProvider<ReaderConfig>, 'inject' | 'useFactory'> &
      Pick<DynamicModule, 'imports'>,
    clientName?: string,
  ): DynamicModule;
  static forFeatureAsync(
    type: 'consumer' | 'producer' | 'reader',
    name: string,
    options: (
      | Pick<FactoryProvider<ConsumerConfig>, 'inject' | 'useFactory'>
      | Pick<FactoryProvider<ProducerConfig>, 'inject' | 'useFactory'>
      | Pick<FactoryProvider<ReaderConfig>, 'inject' | 'useFactory'>
    ) &
      Pick<DynamicModule, 'imports'>,
    clientName?: string,
  ): DynamicModule {
    const clientToken = getClientToken(clientName);
    const featureToken = getFeatureToken(type, name);
    const featureConfigToken = getFeatureConfigToken(type, name);

    const configProvider: FactoryProvider<
      ConsumerConfig | ProducerConfig | ReaderConfig
    > = {
      provide: featureConfigToken,
      inject: options.inject,
      useFactory: options.useFactory,
    };

    const featureProvider: FactoryProvider<Consumer | Producer | Reader> = {
      provide: featureToken,
      inject: [clientToken, featureConfigToken],
      useFactory: (
        client: Client,
        config: ConsumerConfig | ProducerConfig | ReaderConfig,
      ) => {
        if (type === 'consumer')
          return client.subscribe(config as ConsumerConfig);
        if (type === 'producer')
          return client.createProducer(config as ProducerConfig);
        if (type === 'reader')
          return client.createReader(config as ReaderConfig);
        throw new Error('Invalid feature type');
      },
    };

    return {
      module: PulsarModule,
      imports: options.imports,
      providers: [configProvider, featureProvider],
      exports: [featureProvider],
    };
  }
}
