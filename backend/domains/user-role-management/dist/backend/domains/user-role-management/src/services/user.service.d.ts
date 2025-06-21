import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
export declare class UserService {
    findAll(): Promise<any>;
    findOne(id: number): Promise<any>;
    create(createUserDto: CreateUserDto): Promise<{
        id: any;
        email: any;
        name: any;
        role: any;
        department: any;
        phone: any;
        isActive: any;
        tempPassword: string;
    }>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<{
        id: any;
        email: any;
        name: any;
        role: any;
        department: any;
        phone: any;
        isActive: any;
    }>;
    remove(id: number): Promise<{
        deleted: boolean;
    }>;
    assignRole(id: number, role: string): Promise<{
        id: any;
        email: any;
        name: any;
        role: any;
        isActive: any;
    }>;
    getUserPermissions(id: number): Promise<{
        userId: number;
        role: any;
        permissions: string[];
        effectivePermissions: string[];
    }>;
    private getDefaultPermissions;
    private getEffectivePermissions;
}
