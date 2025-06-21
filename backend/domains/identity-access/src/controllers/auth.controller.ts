import { Controller, Get, Post, Put, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  getHealth() {
    return { 
      status: 'healthy', 
      service: 'identity-access',
      timestamp: new Date().toISOString()
    };
  }

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'User logout' })
  // Bearer auth disabled
  // Auth disabled for development
  async logout(@Request() req) {
    return this.authService.logout(req.user.id);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('validate-token')
  @ApiOperation({ summary: 'Validate JWT token for microservices' })
  @ApiResponse({ status: 200, description: 'Token validation result' })
  async validateToken(@Body('token') token: string) {
    try {
      if (!token) {
        return { valid: false, error: 'No token provided' };
      }

      // Use existing auth service to validate token
      const result = await this.authService.validateToken(token);
      return { valid: true, user: result };
    } catch (error) {
      return { valid: false, error: error.message || 'Invalid token' };
    }
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password with token' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  // Bearer auth disabled
  // Auth disabled for development
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update user profile' })
  // Bearer auth disabled
  // Auth disabled for development
  async updateProfile(@Request() req, @Body() updateData: any) {
    return this.authService.updateProfile(req.user.id, updateData);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify email address' })
  async verifyEmail(@Body('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Get('sessions')
  @ApiOperation({ summary: 'Get active sessions' })
  // Bearer auth disabled
  // Auth disabled for development
  async getSessions(@Request() req) {
    return this.authService.getActiveSessions(req.user.id);
  }
}