import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { BarcodeService } from '../services/barcode.service';
import { CreateBarcodeDto, BarcodeType } from '../dto/create-barcode.dto';

@ApiTags('barcodes')
// Bearer auth disabled
// Auth disabled for development
@Controller('barcodes')
export class BarcodeController {
  constructor(private readonly barcodeService: BarcodeService) {}

  @Post()
  @ApiOperation({ summary: 'Generate a new barcode' })
  @ApiResponse({ status: 201, description: 'Barcode generated successfully' })
  async generateBarcode(@Body() createBarcodeDto: CreateBarcodeDto) {
    return this.barcodeService.generateBarcode(createBarcodeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all barcodes' })
  @ApiResponse({ status: 200, description: 'List of barcodes' })
  @ApiQuery({ name: 'type', enum: BarcodeType, required: false })
  @ApiQuery({ name: 'productId', type: Number, required: false })
  async getBarcodes(
    @Query('type') type?: BarcodeType,
    @Query('productId') productId?: number,
  ) {
    return this.barcodeService.getBarcodes({ type, productId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get barcode by ID' })
  @ApiResponse({ status: 200, description: 'Barcode details' })
  async getBarcodeById(@Param('id') id: number) {
    return this.barcodeService.getBarcodeById(id);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download barcode file' })
  @ApiResponse({ status: 200, description: 'Barcode file' })
  async downloadBarcode(@Param('id') id: number) {
    return this.barcodeService.downloadBarcode(id);
  }

  @Get('stats/generation')
  @ApiOperation({ summary: 'Get barcode generation statistics' })
  @ApiResponse({ status: 200, description: 'Barcode generation stats' })
  async getBarcodeStats() {
    return this.barcodeService.getBarcodeStats();
  }
}