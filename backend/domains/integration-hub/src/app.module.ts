import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IntegrationHubController } from './controllers/integration-hub.controller';
import { IntegrationHubService } from './services/integration-hub.service';
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
  controllers: [IntegrationHubController],
  providers: [IntegrationHubService],
})
export class AppModule {}