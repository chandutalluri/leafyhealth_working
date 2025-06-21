import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { PrintService } from '../services/print.service';
import { CreatePrintJobDto, PrintPriority } from '../dto/create-print-job.dto';

@ApiTags('printing')
// Bearer auth disabled
// Auth disabled for development
@Controller('print')
export class PrintController {
  constructor(private readonly printService: PrintService) {}

  @Post('jobs')
  @ApiOperation({ summary: 'Create a new print job' })
  @ApiResponse({ status: 201, description: 'Print job created successfully' })
  async createPrintJob(@Body() createPrintJobDto: CreatePrintJobDto) {
    return this.printService.createPrintJob(createPrintJobDto);
  }

  @Get('jobs')
  @ApiOperation({ summary: 'Get all print jobs' })
  @ApiResponse({ status: 200, description: 'List of print jobs' })
  @ApiQuery({ name: 'status', type: String, required: false })
  @ApiQuery({ name: 'priority', enum: PrintPriority, required: false })
  async getPrintJobs(
    @Query('status') status?: string,
    @Query('priority') priority?: PrintPriority,
  ) {
    return this.printService.getPrintJobs({ status, priority });
  }

  @Get('jobs/:id')
  @ApiOperation({ summary: 'Get print job by ID' })
  @ApiResponse({ status: 200, description: 'Print job details' })
  async getPrintJobById(@Param('id') id: number) {
    return this.printService.getPrintJobById(id);
  }

  @Post('jobs/:id/cancel')
  @ApiOperation({ summary: 'Cancel print job' })
  @ApiResponse({ status: 200, description: 'Print job cancelled' })
  async cancelPrintJob(@Param('id') id: number) {
    return this.printService.cancelPrintJob(id);
  }

  @Get('printers')
  @ApiOperation({ summary: 'Get available printers' })
  @ApiResponse({ status: 200, description: 'List of printers' })
  async getPrinters() {
    return this.printService.getPrinters();
  }

  @Get('queue/status')
  @ApiOperation({ summary: 'Get print queue status' })
  @ApiResponse({ status: 200, description: 'Print queue status' })
  async getQueueStatus() {
    return this.printService.getQueueStatus();
  }

  @Get('stats/overview')
  @ApiOperation({ summary: 'Get printing statistics' })
  @ApiResponse({ status: 200, description: 'Printing statistics' })
  async getPrintingStats() {
    return this.printService.getPrintingStats();
  }
}