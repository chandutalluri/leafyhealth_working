import { db } from '../database/connection';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../dto/employee-management.dto';
export declare class EmployeeManagementService {
    private database;
    constructor(database: typeof db);
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
    getAllEmployees(): Promise<any[]>;
    getEmployeeById(id: number): Promise<{
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
    updateEmployee(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<{
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
    deleteEmployee(id: number): Promise<{
        message: string;
        deletedEmployee: {
            id: number;
            employeeId: string;
        };
    }>;
    getEmployeesByDepartment(department: string): Promise<any[]>;
    getDashboardOverview(): Promise<{
        totalEmployees: number;
        activeEmployees: number;
        departments: string[];
        lastUpdated: string;
    }>;
    getHealthStatus(): Promise<{
        status: string;
        timestamp: string;
        service: string;
    }>;
    findAllEmployees(page?: number, limit?: number): Promise<{
        employees: any[];
        pagination: {
            currentPage: number;
            totalPages: number;
            totalEmployees: number;
        };
    }>;
    findEmployeeById(id: number): Promise<{
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
    findAllDepartments(): Promise<string[]>;
    getEmployeePerformance(id: number): Promise<{
        employeeId: number;
        performanceScore: number;
        goals: any[];
        reviews: any[];
        lastReviewDate: Date;
    }>;
}
