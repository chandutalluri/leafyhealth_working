import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CompanyManagementController } from './controllers/company-management.controller';
import { CompanyManagementService } from './services/company-management.service';
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
  controllers: [CompanyManagementController],
  providers: [CompanyManagementService],
})
export class AppModule {}