import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    findAll(req: any): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    create(createUserDto: CreateUserDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: any;
            email: any;
            name: any;
            role: any;
            department: any;
            phone: any;
            isActive: any;
            tempPassword: string;
        };
    }>;
    update(id: string, updateUserDto: UpdateUserDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: any;
            email: any;
            name: any;
            role: any;
            department: any;
            phone: any;
            isActive: any;
        };
    }>;
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    assignRole(id: string, role: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            id: any;
            email: any;
            name: any;
            role: any;
            isActive: any;
        };
    }>;
    getPermissions(id: string): Promise<{
        success: boolean;
        message: string;
        data: {
            userId: number;
            role: any;
            permissions: string[];
            effectivePermissions: string[];
        };
    }>;
}
