import { EmployeeManagementService } from '../services/employee-management.service';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dto/employee-management.dto';
export declare class EmployeeManagementController {
    private readonly employeeManagementService;
    constructor(employeeManagementService: EmployeeManagementService);
    getHealth(): Promise<{
        status: string;
        timestamp: string;
        service: string;
    }>;
    createEmployee(createEmployeeDto: CreateEmployeeDto): Promise<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        department: string;
        position: string;
        salary: number;
        hireDate: string;
        status: string;
        managerId: number;
        createdAt: Date;
    }>;
    getAllEmployees(page?: string, limit?: string, search?: string, department?: string, status?: string): Promise<{
        employees: any[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalEmployees: number;
        };
    }>;
    getEmployeeById(id: string): Promise<{
        id: number;
        userId: number;
        employeeId: string;
        firstName: string;
        lastName: string;
        email: string;
        department: string;
        position: string;
        salary: number;
        hireDate: Date;
        status: string;
        manager: any;
        benefits: {};
        createdAt: Date;
    }>;
    updateEmployee(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<{
        updatedAt: Date;
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
        department?: string;
        position?: string;
        salary?: number;
        address?: string;
        managerId?: number;
        status?: import("../dto/employee-management.dto").EmployeeStatus;
        id: number;
    }>;
    deleteEmployee(id: string): Promise<{
        message: string;
        deletedEmployee: {
            id: number;
            employeeId: string;
        };
    }>;
    getDepartments(): Promise<string[]>;
    getEmployeePerformance(id: string): Promise<{
        employeeId: number;
        performanceScore: number;
        goals: any[];
        reviews: any[];
        lastReviewDate: Date;
    }>;
}
