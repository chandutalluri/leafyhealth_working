import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AccountingManagementController } from './controllers/accounting-management.controller';
import { AccountingManagementService } from './services/accounting-management.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
  ],
  controllers: [AccountingManagementController],
  providers: [AccountingManagementService],
})
export class AppModule {}