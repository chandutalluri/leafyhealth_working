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
exports.InventoryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const inventory_service_1 = require("../services/inventory.service");
const create_inventory_transaction_dto_1 = require("../dto/create-inventory-transaction.dto");
const create_adjustment_dto_1 = require("../dto/create-adjustment.dto");
let InventoryController = class InventoryController {
    constructor(inventoryService) {
        this.inventoryService = inventoryService;
    }
    async getAllStock() {
        return this.inventoryService.getAllStock();
    }
    async getLowStockItems() {
        return this.inventoryService.getLowStockItems();
    }
    async getProductStock(productId) {
        return this.inventoryService.getProductStock(parseInt(productId));
    }
    async recordTransaction(transactionDto, req) {
        const performedBy = req.user?.id || 1;
        return this.inventoryService.recordTransaction(transactionDto, performedBy);
    }
    async getTransactionHistory(productId) {
        const id = productId ? parseInt(productId) : undefined;
        return this.inventoryService.getTransactionHistory(id);
    }
    async adjustInventory(adjustmentDto, req) {
        const performedBy = req.user?.id || 1;
        const approvedBy = req.user?.id || 1;
        return this.inventoryService.adjustInventory(adjustmentDto, performedBy, approvedBy);
    }
    async getActiveStockAlerts() {
        return this.inventoryService.getActiveStockAlerts();
    }
};
exports.InventoryController = InventoryController;
__decorate([
    (0, common_1.Get)('stock'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all stock levels' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Stock levels retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getAllStock", null);
__decorate([
    (0, common_1.Get)('stock/low'),
    (0, swagger_1.ApiOperation)({ summary: 'Get low stock items' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Low stock items retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getLowStockItems", null);
__decorate([
    (0, common_1.Get)('stock/:productId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get stock level for specific product' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Product stock retrieved successfully' }),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getProductStock", null);
__decorate([
    (0, common_1.Post)('transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Record inventory transaction' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Transaction recorded successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_inventory_transaction_dto_1.CreateInventoryTransactionDto, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "recordTransaction", null);
__decorate([
    (0, common_1.Get)('transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Get transaction history' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Transaction history retrieved successfully' }),
    __param(0, (0, common_1.Query)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getTransactionHistory", null);
__decorate([
    (0, common_1.Put)('adjustments'),
    (0, swagger_1.ApiOperation)({ summary: 'Make inventory adjustment' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Inventory adjusted successfully' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_adjustment_dto_1.CreateAdjustmentDto, Object]),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "adjustInventory", null);
__decorate([
    (0, common_1.Get)('alerts'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active stock alerts' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Stock alerts retrieved successfully' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InventoryController.prototype, "getActiveStockAlerts", null);
exports.InventoryController = InventoryController = __decorate([
    (0, swagger_1.ApiTags)('inventory'),
    (0, common_1.Controller)('inventory'),
    __metadata("design:paramtypes", [inventory_service_1.InventoryService])
], InventoryController);
//# sourceMappingURL=inventory.controller.js.map