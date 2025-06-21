import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderStatusDto } from '../dto/update-order-status.dto';
import { UpdatePaymentStatusDto } from '../dto/update-payment-status.dto';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    if (!req.user?.id) {
    }
    const createdBy = req.user.id;
    return this.orderService.createOrder(createOrderDto, createdBy);
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  async findAll() {
    return this.orderService.findAll();
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Get orders by status' })
  @ApiResponse({ status: 200, description: 'Orders by status retrieved successfully' })
  async findByStatus(@Param('status') status: string) {
    return this.orderService.findByStatus(status);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get orders by customer' })
  @ApiResponse({ status: 200, description: 'Customer orders retrieved successfully' })
  async findByCustomer(@Param('customerId') customerId: string) {
    return this.orderService.findByCustomer(parseInt(customerId));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  async findOne(@Param('id') id: string) {
    return this.orderService.findOne(parseInt(id));
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  @ApiResponse({ status: 200, description: 'Order status updated successfully' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
    @Request() req
  ) {
    if (!req.user?.id) {
    }
    const changedBy = req.user.id;
    return this.orderService.updateOrderStatus(parseInt(id), updateStatusDto, changedBy);
  }

  @Put(':id/payment')
  @ApiOperation({ summary: 'Update payment status' })
  @ApiResponse({ status: 200, description: 'Payment status updated successfully' })
  async updatePaymentStatus(
    @Param('id') id: string,
    @Body() updatePaymentDto: UpdatePaymentStatusDto,
    @Request() req
  ) {
    const updatedBy = req.user?.id || 1; // Default to user 1 if not available
    return this.orderService.updatePaymentStatus(parseInt(id), updatePaymentDto, updatedBy);
  }

  // ENHANCED: Intelligent Order Management
  @Post('bundle-delivery')
  @ApiOperation({ summary: 'Bundle orders for optimized delivery' })
  @ApiResponse({ status: 200, description: 'Orders bundled successfully' })
  @Roles('admin', 'manager', 'ops')
  async bundleOrdersForDelivery(@Body() bundleData: {
    deliveryZone: string;
    timeWindow?: number;
  }) {
    return this.orderService.bundleOrdersForDelivery(
      bundleData.deliveryZone,
      bundleData.timeWindow
    );
  }

  @Post('retry-failed')
  @ApiOperation({ summary: 'Auto-retry failed orders' })
  @ApiResponse({ status: 200, description: 'Failed orders processed' })
  @Roles('admin', 'manager')
  async autoRetryFailedOrders(@Body() retryConfig: { maxRetries?: number }) {
    return this.orderService.autoRetryFailedOrders(retryConfig.maxRetries);
  }

  @Put(':id/optimize-routing')
  @ApiOperation({ summary: 'Optimize order routing and fulfillment' })
  @ApiResponse({ status: 200, description: 'Order routing optimized' })
  @Roles('admin', 'manager', 'ops')
  async optimizeOrderRouting(@Param('id') id: string) {
    return this.orderService.optimizeOrderRouting(parseInt(id));
  }

  @Post(':id/partial-fulfillment')
  @ApiOperation({ summary: 'Handle partial order fulfillment' })
  @ApiResponse({ status: 200, description: 'Partial fulfillment processed' })
  @Roles('admin', 'manager')
  async handlePartialFulfillment(
    @Param('id') id: string,
    @Body() fulfillmentData: { availableItems: any[] }
  ) {
    return this.orderService.handlePartialFulfillment(
      parseInt(id),
      fulfillmentData.availableItems
    );
  }
}