import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  ParseIntPipe,
  NotFoundException,
  ConflictException,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

@ApiTags('Customers')
// Bearer auth disabled
// Auth disabled for development
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully' })
  @ApiResponse({ status: 409, description: 'Customer with email already exists' })
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    try {
      // Check if customer with email already exists
      const existingCustomer = await this.customerService.findCustomerByEmail(createCustomerDto.email);
      if (existingCustomer) {
        throw new ConflictException('Customer with this email already exists');
      }

      const customerData = {
        ...createCustomerDto,
        dateOfBirth: createCustomerDto.dateOfBirth ? new Date(createCustomerDto.dateOfBirth) : undefined
      };
      const customer = await this.customerService.createCustomer(customerData);
      return {
        success: true,
        message: 'Customer created successfully',
        data: customer
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error(`Failed to create customer: ${error.message}`);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'List of all customers' })
  async getAllCustomers() {
    const customers = await this.customerService.findAllCustomers();
    return {
      success: true,
      data: customers,
      count: customers.length
    };
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get customer statistics' })
  @ApiResponse({ status: 200, description: 'Customer statistics' })
  async getCustomerStats() {
    const stats = await this.customerService.getCustomerStats();
    return {
      success: true,
      data: stats
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer details' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async getCustomerById(@Param('id', ParseIntPipe) id: number) {
    const customer = await this.customerService.findCustomerById(id);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return {
      success: true,
      data: customer
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async updateCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCustomerDto: UpdateCustomerDto
  ) {
    const updateData = {
      ...updateCustomerDto,
      dateOfBirth: updateCustomerDto.dateOfBirth ? new Date(updateCustomerDto.dateOfBirth) : undefined
    };
    const customer = await this.customerService.updateCustomer(id, updateData);
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return {
      success: true,
      message: 'Customer updated successfully',
      data: customer
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete customer' })
  @ApiParam({ name: 'id', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'Customer deleted successfully' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async deleteCustomer(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.customerService.deleteCustomer(id);
    if (!deleted) {
      throw new NotFoundException('Customer not found');
    }
    return {
      success: true,
      message: 'Customer deleted successfully'
    };
  }
}