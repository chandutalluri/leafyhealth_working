import { ConfigService } from '@nestjs/config';
export interface JwtPayload {
    sub: number;
    email: string;
    roles: string[];
    companyId?: number;
    branchId?: number;
    iat?: number;
    exp?: number;
}
declare const JwtStrategy_base: new (...args: any) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): Promise<{
        userId: number;
        email: string;
        roles: string[];
        companyId: number;
        branchId: number;
    }>;
}
export {};
