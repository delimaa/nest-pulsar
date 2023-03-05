<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore"><img src="https://img.shields.io/npm/dm/@nestjs/core.svg" alt="NPM Downloads" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://api.travis-ci.org/nestjs/nest.svg?branch=master" alt="Travis" /></a>
<a href="https://travis-ci.org/nestjs/nest"><img src="https://img.shields.io/travis/nestjs/nest/master.svg?label=linux" alt="Linux" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#5" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec"><img src="https://img.shields.io/badge/Donate-PayPal-dc3d53.svg"/></a>
  <a href="https://twitter.com/nestframework"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Apache Pulsar](https://pulsar.apache.org) module for [Nest](https://nestjs.com).

## Installation

```bash
$ npm install --save nest-pulsar pulsar-client
```

## Getting started

Once the installation process (npm install) is complete, we can import the `PulsarModule` into the root `AppModule`.

```ts
import { Module } from '@nestjs/common';
import { PulsarModule } from 'nest-pulsar';

@Module({
  imports: [
    PulsarModule.forRoot({
      serviceUrl: 'pulsar://localhost:6650',
    }),
  ],
})
export class AppModule {}
```

The `forRoot()` method supports all the configuration properties exposed by the Client class constructor from the `pulsar-client` package.

> **Note** > `forRoot()` inject the Pulsar Client provider globally.

Next, let's look at another module, let's say the `UsersModule`.

Once the pulsar Client configured. You can inject the needed `Producer`, `Consumer` and/or `Reader` using the `forFeature()` method:

```ts
import { Module } from '@nestjs/common';
import { PulsarModule } from 'nest-pulsar';

@Module({
  imports: [
    PulsarModule.forFeature('producer', 'myProducer', {
      topic: 'myTopic',
    }),
    PulsarModule.forFeature('consumer', 'myConsumer', {
      subscription: 'mySubscription',
      topic: 'myTopic',
    }),
    PulsarModule.forFeature('reader', 'myReader', {
      topic: 'myTopic',
      startMessageId: MessageId.latest(),
    }),
  ],
})
export class UsersModule {}
```

> **Warning**
> Producer, consumer or reader name (2nd param) is mandatory. Please note that you shouldn't have multiple producers, consumers or readers with the same name, otherwise they will get overridden.

The `forFeature()` method third param supports all the configuration properties exposed by the following Pulsar `Client` factory methods:

- `producer` feature configuration object corresponds to `client.createProducer()` configuration object.
- `consumer` feature configuration object corresponds to `client.subscribe()` configuration object.
- `reader` feature configuration object corresponds to `client.createReader()` configuration object.

This module uses the `forFeature()` method to define which features (producer, consumer or reader) are registered in the current scope. With that in place, we can inject the `Producer`, `Consumer` and `Reader` Pulsar objects into the UsersService using the @PulsarInject() decorator:

```ts
import { Injectable } from '@nestjs/common';
import { InjectPulsar } from 'nest-pulsar';
import { Producer, Consumer, Reader } from 'pulsar-client';

@Injectable()
export class UsersService {
  constructor(
    @InjectPulsar('producer', 'myProducer')
    private readonly producer: Producer,
    @InjectPulsar('consumer', 'myConsumer')
    private readonly consumer: Consumer,
    @InjectPulsar('reader', 'myReader')
    private readonly reader: Reader,
  ) {}

  async publishHelloPulsar() {
    await this.producer.send({
      data: Buffer.from('Hello, Pulsar'),
    });
  }
}
```

If you want to use the producer, consumer or reader outside of the module which imports `PulsarModule.forFeature()`, you'll need to re-export the providers generated by it. You can do this by exporting the whole module, like this:

```ts
import { Module } from '@nestjs/common';
import { PulsarModule } from 'nest-pulsar';

@Module({
  imports: [
    PulsarModule.forFeature('producer', 'myProducer', {
      topic: 'myTopic',
    }),
  ],
  exports: [PulsarModule],
})
export class UsersModule {}
```

## Async configuration

You may want to pass your module options asynchronously instead of statically. In this case, use the `forRootAsync()` method:

```ts
import { Module } from '@nestjs/common';
import { PulsarModule } from 'nest-pulsar';

@Module({
  imports: [
    PulsarModule.forRootAsync({
      useFactory: () => ({
        serviceUrl: 'pulsar://localhost:6650',
      }),
    }),
  ],
})
export class AppModule {}
```

Our factory behaves like any other asynchronous provider (e.g., it can be async and it's able to inject dependencies through inject):

```ts
import { Module } from '@nestjs/common';
import { PulsarModule } from 'nest-pulsar';

@Module({
  imports: [
    PulsarModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        serviceUrl: config.get('SERVICE_URL'),
      }),
    }),
  ],
})
export class AppModule {}
```

## Multiple clients

Some projects require multiple pulsar clients. This can also be achieved with this module. To work with multiple clients, first create the clients. In this case, client naming becomes mandatory.

```ts
import { Module } from '@nestjs/common';
import { PulsarModule } from 'nest-pulsar';

@Module({
  imports: [
    PulsarModule.forRoot({
      serviceUrl: 'pulsar://localhost:6650',
    }),
    PulsarModule.forRoot(
      {
        serviceUrl: 'pulsar://other.client:6650',
      },
      'myOtherClient', // client name
    ),
  ],
})
export class AppModule {}
```

> **Warning**
> If you don't set the name for a client, its name is set to default. Please note that you shouldn't have multiple clients without a name, or with the same name, otherwise they will get overridden.

If you are using `PulsarModule.forRootAsync()`, you have to also set the client name the same way:

```ts
import { Module } from '@nestjs/common';
import { PulsarModule } from 'nest-pulsar';

@Module({
  imports: [
    PulsarModule.forRootAsync({
      useFactory: () => ({
        serviceUrl: 'pulsar://localhost:6650',
      }),
    }),
    PulsarModule.forRootAsync(
      {
        useFactory: () => ({
          serviceUrl: 'pulsar://other.client:6650',
        }),
      },
      'myOtherClient',
    ),
  ],
})
export class AppModule {}
```

## Testing

When it comes to unit testing an application, we usually want to avoid making a real Pulsar connection, keeping our test suites independent and their execution process as fast as possible. But our classes might depend on producers, consumers or readears that are pulled that are created from the client instance. How do we handle that? The solution is to create mocks. In order to achieve that, we set up custom providers. Each registered producer, consumer or reader is automatically represented by an auto-generated token.

The nest-pulsar package exposes the `getFeatureToken()` function which returns a prepared token based on a given feature type and name.

```ts
@Module({
  providers: [
    UsersService,
    {
      provide: getFeatureToken('consumer', 'myConsumer'),
      useValue: mockConsumer,
    },
  ],
})
export class UsersModule {}
```

Now a substitute mockConsumer will be used as the `Consumer` named `myConsumer`. Whenever any class asks for `myConsumer` using an `@PulsarInject()` decorator, Nest will use the registered mockConsumer object.

## License

Nest Pulsar is [MIT licensed](LICENSE).
