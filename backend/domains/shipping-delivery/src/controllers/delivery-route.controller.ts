import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DeliveryRouteService, DeliveryRoute } from '../services/delivery-route.service';
import { CreateDeliveryRouteDto } from '../dto/create-delivery-route.dto';
import { UpdateDeliveryRouteDto } from '../dto/update-delivery-route.dto';

@ApiTags('delivery-routes')
@Controller('delivery-routes')
export class DeliveryRouteController {
  constructor(private readonly routeService: DeliveryRouteService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new delivery route' })
  @ApiResponse({ status: 201, description: 'Route created successfully' })
  create(@Body() createRouteDto: CreateDeliveryRouteDto): Promise<DeliveryRoute> {
    return this.routeService.create(createRouteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all delivery routes' })
  @ApiResponse({ status: 200, description: 'List of delivery routes' })
  findAll(@Query('status') status?: string, @Query('driverId') driverId?: string): Promise<DeliveryRoute[]> {
    if (status) return this.routeService.findByStatus(status);
    if (driverId) return this.routeService.findByDriver(parseInt(driverId));
    return this.routeService.findAll();
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get route statistics' })
  @ApiResponse({ status: 200, description: 'Route statistics' })
  getStatistics() {
    return this.routeService.getRouteStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a delivery route by ID' })
  @ApiResponse({ status: 200, description: 'Route found' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<DeliveryRoute> {
    return this.routeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a delivery route' })
  @ApiResponse({ status: 200, description: 'Route updated successfully' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateRouteDto: UpdateDeliveryRouteDto): Promise<DeliveryRoute> {
    return this.routeService.update(id, updateRouteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a delivery route' })
  @ApiResponse({ status: 204, description: 'Route deleted successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.routeService.remove(id);
  }
}