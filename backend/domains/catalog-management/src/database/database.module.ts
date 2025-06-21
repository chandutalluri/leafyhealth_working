import { Module } from '@nestjs/common';
import { DatabaseService } from './connection';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}