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
exports.CreatePrintJobDto = exports.PaperType = exports.PrintQuality = exports.PrintPriority = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
var PrintPriority;
(function (PrintPriority) {
    PrintPriority["LOW"] = "low";
    PrintPriority["NORMAL"] = "normal";
    PrintPriority["HIGH"] = "high";
    PrintPriority["URGENT"] = "urgent";
})(PrintPriority || (exports.PrintPriority = PrintPriority = {}));
var PrintQuality;
(function (PrintQuality) {
    PrintQuality["DRAFT"] = "draft";
    PrintQuality["NORMAL"] = "normal";
    PrintQuality["HIGH"] = "high";
    PrintQuality["BEST"] = "best";
})(PrintQuality || (exports.PrintQuality = PrintQuality = {}));
var PaperType;
(function (PaperType) {
    PaperType["STANDARD"] = "standard";
    PaperType["GLOSSY"] = "glossy";
    PaperType["MATTE"] = "matte";
    PaperType["WATERPROOF"] = "waterproof";
    PaperType["ADHESIVE"] = "adhesive";
})(PaperType || (exports.PaperType = PaperType = {}));
class CreatePrintJobDto {
}
exports.CreatePrintJobDto = CreatePrintJobDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Print job name' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrintJobDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Label IDs to print', type: [Number] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    __metadata("design:type", Array)
], CreatePrintJobDto.prototype, "labelIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Printer ID to use', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePrintJobDto.prototype, "printerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of copies per label', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreatePrintJobDto.prototype, "copies", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PrintPriority, description: 'Print job priority', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(PrintPriority),
    __metadata("design:type", String)
], CreatePrintJobDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PrintQuality, description: 'Print quality', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(PrintQuality),
    __metadata("design:type", String)
], CreatePrintJobDto.prototype, "quality", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PaperType, description: 'Paper type', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(PaperType),
    __metadata("design:type", String)
], CreatePrintJobDto.prototype, "paperType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Print immediately', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreatePrintJobDto.prototype, "printImmediately", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Schedule print for later', required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], CreatePrintJobDto.prototype, "scheduledFor", void 0);
//# sourceMappingURL=create-print-job.dto.js.map