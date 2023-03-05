import {
  DynamicModule,
  FactoryProvider,
  Global,
  Inject,
  Logger,
  Module,
  OnApplicationShutdown,
  ValueProvider,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Client, ClientConfig } from 'pulsar-client';
import { getClientConfigToken, getClientToken } from './pulsar.utils';
import {
  DEFAULT_CLIENT_NAME,
  PULSAR_CLIENT_NAME_TOKEN,
} from './pulsar.constants';

@Global()
@Module({})
export class PulsarCoreModule implements OnApplicationShutdown {
  private readonly logger = new Logger(PulsarCoreModule.name);

  constructor(
    @Inject(PULSAR_CLIENT_NAME_TOKEN)
    private readonly clientName: string,
    private readonly moduleRef: ModuleRef,
  ) {}

  static forRoot(config: ClientConfig, clientName?: string): DynamicModule {
    const clientToken = getClientToken(clientName);
    const client = new Client(config);

    const clientNameProvider: ValueProvider = {
      provide: PULSAR_CLIENT_NAME_TOKEN,
      useValue: clientName ?? DEFAULT_CLIENT_NAME,
    };

    const clientProvider: ValueProvider = {
      provide: clientToken,
      useValue: client,
    };

    return {
      module: PulsarCoreModule,
      providers: [clientNameProvider, clientProvider],
      exports: [clientProvider],
    };
  }

  static forRootAsync(
    options: Pick<FactoryProvider<ClientConfig>, 'inject' | 'useFactory'> &
      Pick<DynamicModule, 'imports'>,
    clientName?: string,
  ): DynamicModule {
    const clientToken = getClientToken(clientName);
    const clientConfigToken = getClientConfigToken(clientName);

    const clientNameProvider: ValueProvider = {
      provide: PULSAR_CLIENT_NAME_TOKEN,
      useValue: clientName ?? DEFAULT_CLIENT_NAME,
    };

    const configProvider: FactoryProvider<ClientConfig> = {
      provide: clientConfigToken,
      inject: options.inject,
      useFactory: options.useFactory,
    };

    const clientProvider: FactoryProvider<Client> = {
      provide: clientToken,
      inject: [clientConfigToken],
      useFactory: (config: ClientConfig) => {
        const client = new Client(config);
        return client;
      },
    };

    return {
      module: PulsarCoreModule,
      imports: options.imports,
      providers: [clientNameProvider, configProvider, clientProvider],
      exports: [clientProvider],
    };
  }

  async onApplicationShutdown() {
    const client = this.moduleRef.get<Client>(getClientToken(this.clientName));

    try {
      await client.close();
    } catch (e) {
      this.logger.error(e?.message);
    }
  }
}
