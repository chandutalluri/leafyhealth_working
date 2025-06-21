import { CreateInventoryTransactionDto } from '../dto/create-inventory-transaction.dto';
import { CreateAdjustmentDto } from '../dto/create-adjustment.dto';
export declare class InventoryService {
    getProductStock(productId: number): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
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
    recordTransaction(transactionDto: CreateInventoryTransactionDto, performedBy: number): Promise<{
        success: boolean;
        message: string;
        data: {
            transaction: any;
            newStockLevel: any;
            previousStockLevel: any;
        };
    }>;
    adjustInventory(adjustmentDto: CreateAdjustmentDto, performedBy: number, approvedBy?: number): Promise<{
        success: boolean;
        message: string;
        data: {
            adjustment: any;
            oldQuantity: any;
            newQuantity: number;
        };
    }>;
    getTransactionHistory(productId?: number): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getActiveStockAlerts(): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    private checkStockAlerts;
}
