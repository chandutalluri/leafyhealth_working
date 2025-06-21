export declare enum EmployeeStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    TERMINATED = "terminated",
    ON_LEAVE = "on_leave"
}
export declare class CreateEmployeeDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    salary: number;
    hireDate: string;
    address?: string;
    managerId?: number;
    status?: EmployeeStatus;
}
export declare class UpdateEmployeeDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    department?: string;
    position?: string;
    salary?: number;
    address?: string;
    managerId?: number;
    status?: EmployeeStatus;
}
