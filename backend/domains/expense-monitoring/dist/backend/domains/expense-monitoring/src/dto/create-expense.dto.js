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
exports.CreateExpenseDto = exports.ExpenseStatus = exports.ExpenseCategory = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var ExpenseCategory;
(function (ExpenseCategory) {
    ExpenseCategory["OFFICE_SUPPLIES"] = "office_supplies";
    ExpenseCategory["TRAVEL"] = "travel";
    ExpenseCategory["MARKETING"] = "marketing";
    ExpenseCategory["SOFTWARE"] = "software";
    ExpenseCategory["UTILITIES"] = "utilities";
    ExpenseCategory["RENT"] = "rent";
    ExpenseCategory["MEALS"] = "meals";
    ExpenseCategory["EQUIPMENT"] = "equipment";
    ExpenseCategory["PROFESSIONAL_SERVICES"] = "professional_services";
    ExpenseCategory["TRAINING"] = "training";
    ExpenseCategory["OTHER"] = "other";
})(ExpenseCategory || (exports.ExpenseCategory = ExpenseCategory = {}));
var ExpenseStatus;
(function (ExpenseStatus) {
    ExpenseStatus["DRAFT"] = "draft";
    ExpenseStatus["PENDING"] = "pending";
    ExpenseStatus["APPROVED"] = "approved";
    ExpenseStatus["REJECTED"] = "rejected";
    ExpenseStatus["PAID"] = "paid";
})(ExpenseStatus || (exports.ExpenseStatus = ExpenseStatus = {}));
class CreateExpenseDto {
}
exports.CreateExpenseDto = CreateExpenseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expense title/description' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expense amount', example: 150.00 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsPositive)(),
    __metadata("design:type", Number)
], CreateExpenseDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ExpenseCategory, description: 'Expense category' }),
    (0, class_validator_1.IsEnum)(ExpenseCategory),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Expense date', example: '2024-01-15' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "expenseDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Vendor/supplier name', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "vendor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Cost center or department', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "costCenter", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Project or campaign reference', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "projectCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Receipt URL or file path', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "receiptUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Additional notes', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Submitting employee ID', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateExpenseDto.prototype, "employeeId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ExpenseStatus, description: 'Expense status', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(ExpenseStatus),
    __metadata("design:type", String)
], CreateExpenseDto.prototype, "status", void 0);
//# sourceMappingURL=create-expense.dto.js.map