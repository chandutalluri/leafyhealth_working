import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SimpleImageController } from './simple-image.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local']
    })
  ],
  controllers: [SimpleImageController],
  providers: [],
})
export class AppModule {}