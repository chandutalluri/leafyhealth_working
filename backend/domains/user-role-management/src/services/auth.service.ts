import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async validateToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      return payload;
    } catch (error) {
      return null;
    }
  }

  async validateUser(payload: any) {
    // Validate user from payload
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      name: payload.name
    };
  }
}