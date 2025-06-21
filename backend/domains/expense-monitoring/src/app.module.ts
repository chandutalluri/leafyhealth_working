import { Module } from '@nestjs/common';
import { SharedAuthModule } from '../../../../shared/auth';
import { ConfigModule } from '@nestjs/config';
import { ExpenseController } from './controllers/expense.controller';
import { BudgetController } from './controllers/budget.controller';
import { AnalyticsController } from './controllers/analytics.controller';
import { HealthController } from './controllers/health.controller';
import { ExpenseService } from './services/expense.service';
import { BudgetService } from './services/budget.service';
import { AnalyticsService } from './services/analytics.service';

@Module({
  imports: [SharedAuthModule, ConfigModule.forRoot({
      isGlobal: true,
    }),],
  controllers: [
    ExpenseController,
    BudgetController,
    AnalyticsController,
    HealthController,
  ],
  providers: [
    ExpenseService,
    BudgetService,
    AnalyticsService,
  ],
})
export class AppModule {}