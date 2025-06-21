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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBudgetDto = exports.BudgetStatus = exports.BudgetPeriod = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var BudgetPeriod;
(function (BudgetPeriod) {
    BudgetPeriod["MONTHLY"] = "monthly";
    BudgetPeriod["QUARTERLY"] = "quarterly";
    BudgetPeriod["YEARLY"] = "yearly";
})(BudgetPeriod || (exports.BudgetPeriod = BudgetPeriod = {}));
var BudgetStatus;
(function (BudgetStatus) {
    BudgetStatus["DRAFT"] = "draft";
    BudgetStatus["ACTIVE"] = "active";
    BudgetStatus["INACTIVE"] = "inactive";
    BudgetStatus["EXPIRED"] = "expired";
})(BudgetStatus || (exports.BudgetStatus = BudgetStatus = {}));
class CreateBudgetDto {
}
exports.CreateBudgetDto = CreateBudgetDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Budget name/title' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Budget amount', example: 50000.00 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateBudgetDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: BudgetPeriod, description: 'Budget period' }),
    (0, class_validator_1.IsEnum)(BudgetPeriod),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "period", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Budget start date', example: '2024-01-01' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Budget end date', example: '2024-12-31' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "endDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cost center or department', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "costCenter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Applicable expense categories', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateBudgetDto.prototype, "categories", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Budget description', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Alert threshold percentage (0-100)', required: false, example: 80 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBudgetDto.prototype, "alertThreshold", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Budget owner/manager ID', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateBudgetDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: BudgetStatus, description: 'Budget status', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(BudgetStatus),
    __metadata("design:type", String)
], CreateBudgetDto.prototype, "status", void 0);
//# sourceMappingURL=create-budget.dto.js.map