import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { db } from './connection';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'DATABASE_CONNECTION',
      useValue: db,
    },
  ],
  exports: ['DATABASE_CONNECTION'],
})
export class DatabaseModule {}