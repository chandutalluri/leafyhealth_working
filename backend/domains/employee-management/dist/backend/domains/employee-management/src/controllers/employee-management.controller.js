"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeManagementController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const employee_management_service_1 = require("../services/employee-management.service");
const employee_management_dto_1 = require("../dto/employee-management.dto");
let EmployeeManagementController = class EmployeeManagementController {
    constructor(employeeManagementService) {
        this.employeeManagementService = employeeManagementService;
    }
    async getHealth() {
        return this.employeeManagementService.getHealthStatus();
    }
    async createEmployee(createEmployeeDto) {
        return this.employeeManagementService.createEmployee(createEmployeeDto);
    }
    async getAllEmployees(page, limit, search, department, status) {
        return this.employeeManagementService.findAllEmployees(page ? +page : 1, limit ? +limit : 10);
    }
    async getEmployeeById(id) {
        return this.employeeManagementService.findEmployeeById(+id);
    }
    async updateEmployee(id, updateEmployeeDto) {
        return this.employeeManagementService.updateEmployee(+id, updateEmployeeDto);
    }
    async deleteEmployee(id) {
        return this.employeeManagementService.deleteEmployee(+id);
    }
    async getDepartments() {
        return this.employeeManagementService.findAllDepartments();
    }
    async getEmployeePerformance(id) {
        return this.employeeManagementService.getEmployeePerformance(+id);
    }
};
exports.EmployeeManagementController = EmployeeManagementController;
__decorate([
    (0, common_1.Get)('health'),
    (0, swagger_1.ApiOperation)({ summary: 'Health check' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeManagementController.prototype, "getHealth", null);
__decorate([
    (0, common_1.Post)('employees'),
    (0, swagger_1.ApiOperation)({ summary: 'Create new employee' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Employee created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_management_dto_1.CreateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeeManagementController.prototype, "createEmployee", null);
__decorate([
    (0, common_1.Get)('employees'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all employees' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('department')),
    __param(4, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", Promise)
], EmployeeManagementController.prototype, "getAllEmployees", null);
__decorate([
    (0, common_1.Get)('employees/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get employee by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeManagementController.prototype, "getEmployeeById", null);
__decorate([
    (0, common_1.Put)('employees/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update employee' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, employee_management_dto_1.UpdateEmployeeDto]),
    __metadata("design:returntype", Promise)
], EmployeeManagementController.prototype, "updateEmployee", null);
__decorate([
    (0, common_1.Delete)('employees/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete employee' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeManagementController.prototype, "deleteEmployee", null);
__decorate([
    (0, common_1.Get)('departments'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all departments' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeManagementController.prototype, "getDepartments", null);
__decorate([
    (0, common_1.Get)('employees/:id/performance'),
    (0, swagger_1.ApiOperation)({ summary: 'Get employee performance metrics' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmployeeManagementController.prototype, "getEmployeePerformance", null);
exports.EmployeeManagementController = EmployeeManagementController = __decorate([
    (0, swagger_1.ApiTags)('employee-management'),
    (0, common_1.Controller)('employee-management'),
    __metadata("design:paramtypes", [employee_management_service_1.EmployeeManagementService])
], EmployeeManagementController);
//# sourceMappingURL=employee-management.controller.js.map