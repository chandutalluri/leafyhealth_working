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
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CustomerAddressService } from '../services/customer-address.service';
import { CreateCustomerAddressDto } from '../dto/create-customer-address.dto';
import { UpdateCustomerAddressDto } from '../dto/update-customer-address.dto';

@ApiTags('Customer Addresses')
// Bearer auth disabled
// Auth disabled for development
@Controller('customers/:customerId/addresses')
export class CustomerAddressController {
  constructor(private readonly customerAddressService: CustomerAddressService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new address for customer' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiResponse({ status: 201, description: 'Address created successfully' })
  async createAddress(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Body() createAddressDto: CreateCustomerAddressDto
  ) {
    const addressData = {
      ...createAddressDto,
      userId: customerId,
      pincode: createAddressDto.postalCode
    };
    const address = await this.customerAddressService.createAddress(addressData);
    return {
      success: true,
      message: 'Address created successfully',
      data: address
    };
  }

  @Get()
  @ApiOperation({ summary: 'Get all addresses for customer' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiResponse({ status: 200, description: 'List of customer addresses' })
  async getCustomerAddresses(@Param('customerId', ParseIntPipe) customerId: number) {
    const addresses = await this.customerAddressService.findAddressesByCustomerId(customerId);
    return {
      success: true,
      data: addresses,
      count: addresses.length
    };
  }

  @Get(':addressId')
  @ApiOperation({ summary: 'Get specific address' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiParam({ name: 'addressId', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Address details' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async getAddressById(@Param('addressId', ParseIntPipe) addressId: number) {
    const address = await this.customerAddressService.findAddressById(addressId);
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return {
      success: true,
      data: address
    };
  }

  @Put(':addressId')
  @ApiOperation({ summary: 'Update address' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiParam({ name: 'addressId', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Address updated successfully' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async updateAddress(
    @Param('addressId', ParseIntPipe) addressId: number,
    @Body() updateAddressDto: UpdateCustomerAddressDto
  ) {
    const address = await this.customerAddressService.updateAddress(addressId, updateAddressDto);
    if (!address) {
      throw new NotFoundException('Address not found');
    }
    return {
      success: true,
      message: 'Address updated successfully',
      data: address
    };
  }

  @Put(':addressId/default')
  @ApiOperation({ summary: 'Set address as default' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiParam({ name: 'addressId', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Default address set successfully' })
  async setDefaultAddress(
    @Param('customerId', ParseIntPipe) customerId: number,
    @Param('addressId', ParseIntPipe) addressId: number
  ) {
    await this.customerAddressService.setDefaultAddress(customerId, addressId);
    return {
      success: true,
      message: 'Default address set successfully'
    };
  }

  @Delete(':addressId')
  @ApiOperation({ summary: 'Delete address' })
  @ApiParam({ name: 'customerId', description: 'Customer ID' })
  @ApiParam({ name: 'addressId', description: 'Address ID' })
  @ApiResponse({ status: 200, description: 'Address deleted successfully' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  async deleteAddress(@Param('addressId', ParseIntPipe) addressId: number) {
    const deleted = await this.customerAddressService.deleteAddress(addressId);
    if (!deleted) {
      throw new NotFoundException('Address not found');
    }
    return {
      success: true,
      message: 'Address deleted successfully'
    };
  }
}