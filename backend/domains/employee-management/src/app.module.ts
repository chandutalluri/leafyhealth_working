import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmployeeManagementController } from './controllers/employee-management.controller';
import { EmployeeManagementService } from './services/employee-management.service';
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
  controllers: [EmployeeManagementController],
  providers: [EmployeeManagementService],
})
export class AppModule {}