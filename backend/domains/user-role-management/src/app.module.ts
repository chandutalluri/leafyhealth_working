import { Module } from '@nestjs/common';
import { SharedAuthModule } from '../../../../shared/auth';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Controllers
import { HealthController } from './controllers/health.controller';
import { IntrospectController } from './controllers/introspect.controller';
import { UserController } from './controllers/user.controller';

// Services
import { UserService } from './services/user.service';
import { EventHandlerService } from './services/event-handler.service';
import { AuthService } from './services/auth.service';

// Guards
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [SharedAuthModule, // MANDATORY: Configuration management
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // MANDATORY: Authentication
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-super-secure-jwt-secret',
      signOptions: { expiresIn: '24h' },
    }),],
  controllers: [
    HealthController,      // MANDATORY
    IntrospectController,  // MANDATORY
    UserController,        // Business logic
  ],
  providers: [
    UserService,           // Core business service
    EventHandlerService,   // MANDATORY
    AuthService,          // MANDATORY
    AuthGuard,            // MANDATORY
  ],
  exports: [
    UserService,
    EventHandlerService,
  ],
})
export class AppModule {}