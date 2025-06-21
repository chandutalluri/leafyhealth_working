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
exports.ComplianceController = void 0;
const common_1 = require("@nestjs/common");
const compliance_service_1 = require("../services/compliance.service");
const create_compliance_event_dto_1 = require("../dto/create-compliance-event.dto");
let ComplianceController = class ComplianceController {
    constructor(complianceService) {
        this.complianceService = complianceService;
    }
    async createEvent(createEventDto) {
        return this.complianceService.createEvent(createEventDto);
    }
    async getEvents(severity, status, entityType) {
        const filters = { severity, status, entityType };
        return this.complianceService.getEvents(filters);
    }
    async getAuditTrail(entityType, entityId) {
        return this.complianceService.getEvents({ entityType });
    }
    async getComplianceStats() {
        return this.complianceService.getEvents({});
    }
    async generateReport(reportData) {
        return this.complianceService.createEvent({
            eventType: 'report',
            entityType: reportData.reportType,
            entityId: parseInt('1'),
            description: 'report_generated',
            severity: 'info',
            metadata: JSON.stringify(reportData)
        });
    }
};
exports.ComplianceController = ComplianceController;
__decorate([
    (0, common_1.Post)('events'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_compliance_event_dto_1.CreateComplianceEventDto]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "createEvent", null);
__decorate([
    (0, common_1.Get)('events'),
    __param(0, (0, common_1.Query)('severity')),
    __param(1, (0, common_1.Query)('status')),
    __param(2, (0, common_1.Query)('entityType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getEvents", null);
__decorate([
    (0, common_1.Get)('audit-trail/:entityType/:entityId'),
    __param(0, (0, common_1.Param)('entityType')),
    __param(1, (0, common_1.Param)('entityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getAuditTrail", null);
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "getComplianceStats", null);
__decorate([
    (0, common_1.Post)('reports/generate'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ComplianceController.prototype, "generateReport", null);
exports.ComplianceController = ComplianceController = __decorate([
    (0, common_1.Controller)('compliance'),
    __metadata("design:paramtypes", [compliance_service_1.ComplianceService])
], ComplianceController);
//# sourceMappingURL=compliance.controller.js.map