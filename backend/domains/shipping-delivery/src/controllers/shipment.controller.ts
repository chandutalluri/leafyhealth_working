import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ShipmentService, Shipment } from '../services/shipment.service';
import { CreateShipmentDto } from '../dto/create-shipment.dto';
import { UpdateShipmentDto } from '../dto/update-shipment.dto';

@ApiTags('shipments')
@Controller('shipments')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new shipment' })
  @ApiResponse({ status: 201, description: 'Shipment created successfully' })
  create(@Body() createShipmentDto: CreateShipmentDto): Promise<Shipment> {
    return this.shipmentService.create(createShipmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all shipments' })
  @ApiResponse({ status: 200, description: 'List of shipments' })
  findAll(@Query('status') status?: string, @Query('customerId') customerId?: string): Promise<Shipment[]> {
    if (status) return this.shipmentService.findByStatus(status);
    if (customerId) return this.shipmentService.findByCustomer(parseInt(customerId));
    return this.shipmentService.findAll();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get shipment statistics' })
  @ApiResponse({ status: 200, description: 'Shipment statistics' })
  getStatistics() {
    return this.shipmentService.getShipmentStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a shipment by ID' })
  @ApiResponse({ status: 200, description: 'Shipment found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Shipment> {
    return this.shipmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a shipment' })
  @ApiResponse({ status: 200, description: 'Shipment updated successfully' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateShipmentDto: UpdateShipmentDto): Promise<Shipment> {
    return this.shipmentService.update(id, updateShipmentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a shipment' })
  @ApiResponse({ status: 204, description: 'Shipment deleted successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.shipmentService.remove(id);
  }
}