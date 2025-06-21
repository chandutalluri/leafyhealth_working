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
exports.PrintController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_1 = require("../../../../../shared/auth");
const print_service_1 = require("../services/print.service");
const create_print_job_dto_1 = require("../dto/create-print-job.dto");
let PrintController = class PrintController {
    constructor(printService) {
        this.printService = printService;
    }
    async createPrintJob(createPrintJobDto) {
        return this.printService.createPrintJob(createPrintJobDto);
    }
    async getPrintJobs(status, priority) {
        return this.printService.getPrintJobs({ status, priority });
    }
    async getPrintJobById(id) {
        return this.printService.getPrintJobById(id);
    }
    async cancelPrintJob(id) {
        return this.printService.cancelPrintJob(id);
    }
    async getPrinters() {
        return this.printService.getPrinters();
    }
    async getQueueStatus() {
        return this.printService.getQueueStatus();
    }
    async getPrintingStats() {
        return this.printService.getPrintingStats();
    }
};
exports.PrintController = PrintController;
__decorate([
    (0, common_1.Post)('jobs'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new print job' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Print job created successfully' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_print_job_dto_1.CreatePrintJobDto]),
    __metadata("design:returntype", Promise)
], PrintController.prototype, "createPrintJob", null);
__decorate([
    (0, common_1.Get)('jobs'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all print jobs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of print jobs' }),
    (0, swagger_1.ApiQuery)({ name: 'status', type: String, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'priority', enum: create_print_job_dto_1.PrintPriority, required: false }),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('priority')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PrintController.prototype, "getPrintJobs", null);
__decorate([
    (0, common_1.Get)('jobs/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get print job by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Print job details' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PrintController.prototype, "getPrintJobById", null);
__decorate([
    (0, common_1.Post)('jobs/:id/cancel'),
    (0, swagger_1.ApiOperation)({ summary: 'Cancel print job' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Print job cancelled' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PrintController.prototype, "cancelPrintJob", null);
__decorate([
    (0, common_1.Get)('printers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get available printers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of printers' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PrintController.prototype, "getPrinters", null);
__decorate([
    (0, common_1.Get)('queue/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get print queue status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Print queue status' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PrintController.prototype, "getQueueStatus", null);
__decorate([
    (0, common_1.Get)('stats/overview'),
    (0, swagger_1.ApiOperation)({ summary: 'Get printing statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Printing statistics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PrintController.prototype, "getPrintingStats", null);
exports.PrintController = PrintController = __decorate([
    (0, swagger_1.ApiTags)('printing'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_1.JwtAuthGuard, auth_1.RolesGuard),
    (0, common_1.Controller)('print'),
    __metadata("design:paramtypes", [print_service_1.PrintService])
], PrintController);
//# sourceMappingURL=print.controller.js.map