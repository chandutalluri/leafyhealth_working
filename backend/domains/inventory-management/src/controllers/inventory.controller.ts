import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from '../services/inventory.service';
import { CreateInventoryTransactionDto } from '../dto/create-inventory-transaction.dto';
import { CreateAdjustmentDto } from '../dto/create-adjustment.dto';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get('stock')
  @ApiOperation({ summary: 'Get all stock levels' })
  @ApiResponse({ status: 200, description: 'Stock levels retrieved successfully' })
  async getAllStock() {
    return this.inventoryService.getAllStock();
  }

  @Get('stock/low')
  @ApiOperation({ summary: 'Get low stock items' })
  @ApiResponse({ status: 200, description: 'Low stock items retrieved successfully' })
  async getLowStockItems() {
    return this.inventoryService.getLowStockItems();
  }

  @Get('stock/:productId')
  @ApiOperation({ summary: 'Get stock level for specific product' })
  @ApiResponse({ status: 200, description: 'Product stock retrieved successfully' })
  async getProductStock(@Param('productId') productId: string) {
    return this.inventoryService.getProductStock(parseInt(productId));
  }

  @Post('transactions')
  @ApiOperation({ summary: 'Record inventory transaction' })
  @ApiResponse({ status: 201, description: 'Transaction recorded successfully' })
  async recordTransaction(
    @Body() transactionDto: CreateInventoryTransactionDto,
    @Request() req
  ) {
    const performedBy = req.user?.id || 1; // Default user for demo
    return this.inventoryService.recordTransaction(transactionDto, performedBy);
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get transaction history' })
  @ApiResponse({ status: 200, description: 'Transaction history retrieved successfully' })
  async getTransactionHistory(@Query('productId') productId?: string) {
    const id = productId ? parseInt(productId) : undefined;
    return this.inventoryService.getTransactionHistory(id);
  }

  @Put('adjustments')
  @ApiOperation({ summary: 'Make inventory adjustment' })
  @ApiResponse({ status: 200, description: 'Inventory adjusted successfully' })
  async adjustInventory(
    @Body() adjustmentDto: CreateAdjustmentDto,
    @Request() req
  ) {
    const performedBy = req.user?.id || 1; // Default user for demo
    const approvedBy = req.user?.id || 1; // Default user for demo
    return this.inventoryService.adjustInventory(adjustmentDto, performedBy, approvedBy);
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get active stock alerts' })
  @ApiResponse({ status: 200, description: 'Stock alerts retrieved successfully' })
  async getActiveStockAlerts() {
    return this.inventoryService.getActiveStockAlerts();
  }
}