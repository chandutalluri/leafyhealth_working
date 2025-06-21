import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private jwtService;
    constructor(jwtService: JwtService);
    validateToken(token: string): Promise<any>;
    validateUser(payload: any): Promise<{
        id: any;
        email: any;
        role: any;
        name: any;
    }>;
}
