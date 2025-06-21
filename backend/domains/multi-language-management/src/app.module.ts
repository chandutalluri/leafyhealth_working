import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LanguageController } from './controllers/language.controller';
import { TranslationController } from './controllers/translation.controller';
import { LanguageService } from './services/language.service';
import { TranslationService } from './services/translation.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [LanguageController, TranslationController],
  providers: [LanguageService, TranslationService],
  exports: [LanguageService, TranslationService],
})
export class AppModule {}