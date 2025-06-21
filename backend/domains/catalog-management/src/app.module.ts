import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CatalogManagementController } from './controllers/catalog-management.controller';
import { CatalogManagementService } from './services/catalog-management.service';
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
  controllers: [CatalogManagementController],
  providers: [CatalogManagementService],
})
export class AppModule {}