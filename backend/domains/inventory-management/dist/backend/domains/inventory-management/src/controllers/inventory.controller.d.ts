import { InventoryService } from '../services/inventory.service';
import { CreateInventoryTransactionDto } from '../dto/create-inventory-transaction.dto';
import { CreateAdjustmentDto } from '../dto/create-adjustment.dto';
export declare class InventoryController {
    private readonly inventoryService;
    constructor(inventoryService: InventoryService);
    getAllStock(): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getLowStockItems(): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getProductStock(productId: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    recordTransaction(transactionDto: CreateInventoryTransactionDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            transaction: any;
            newStockLevel: any;
            previousStockLevel: any;
        };
    }>;
    getTransactionHistory(productId?: string): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    adjustInventory(adjustmentDto: CreateAdjustmentDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: {
            adjustment: any;
            oldQuantity: any;
            newQuantity: number;
        };
    }>;
    getActiveStockAlerts(): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
}
