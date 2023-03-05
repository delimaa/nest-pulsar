import { Module } from '@nestjs/common';
import { PulsarModule } from '../../lib';
import { AppController } from './app.controller';
import { OutsideFeaturesModule } from './outside-features.module';

@Module({
  imports: [
    PulsarModule.forRoot({
      serviceUrl: 'pulsar://localhost:6650',
    }),
    OutsideFeaturesModule,
  ],
  controllers: [AppController],
})
export class AppClientOnlyModule {}
