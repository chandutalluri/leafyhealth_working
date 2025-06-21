import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CatalogManagementService } from '../services/catalog-management.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateProductDto,
  UpdateProductDto,
} from '../dto/catalog-management.dto';

@ApiTags('catalog-management')
@Controller('catalog-management')
export class CatalogManagementController {
  constructor(private readonly catalogManagementService: CatalogManagementService) {}

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({ status: 200, description: 'Service is healthy' })
  getHealth() {
    return {
      status: 'ok',
      service: 'catalog-management',
      timestamp: new Date().toISOString()
    };
  }

  // Category endpoints
  @Post('categories')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  // Bearer auth disabled
  // // // Auth disabled for development) // Disabled for development
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.catalogManagementService.createCategory(createCategoryDto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async getAllCategories() {
    return this.catalogManagementService.getAllCategories();
  }

  @Get('categories/hierarchy')
  @ApiOperation({ summary: 'Get category hierarchy tree' })
  @ApiResponse({ status: 200, description: 'Category hierarchy retrieved successfully' })
  async getCategoryHierarchy() {
    return this.catalogManagementService.getCategoryHierarchy();
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  async getCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.catalogManagementService.getCategoryById(id);
  }

  @Put('categories/:id')
  @ApiOperation({ summary: 'Update category by ID' })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  // Bearer auth disabled
  // // // Auth disabled for development) // Disabled for development
  async updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto
  ) {
    return this.catalogManagementService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete category by ID' })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  // Bearer auth disabled
  // // // Auth disabled for development) // Disabled for development
  async deleteCategory(@Param('id', ParseIntPipe) id: number) {
    return this.catalogManagementService.deleteCategory(id);
  }

  // Product endpoints
  @Post('products')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  // Bearer auth disabled
  // // // Auth disabled for development) // Disabled for development
  async createProduct(@Body() createProductDto: CreateProductDto) {
    return this.catalogManagementService.createProduct(createProductDto);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  async getAllProducts() {
    return this.catalogManagementService.getAllProducts();
  }

  @Get('products/search')
  @ApiOperation({ summary: 'Search products by name' })
  @ApiResponse({ status: 200, description: 'Products search completed' })
  async searchProducts(@Query('q') query: string) {
    return this.catalogManagementService.searchProducts(query);
  }

  @Get('products/category/:categoryId')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiResponse({ status: 200, description: 'Products by category retrieved successfully' })
  async getProductsByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.catalogManagementService.getProductsByCategory(categoryId);
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.catalogManagementService.getProductById(id);
  }

  @Put('products/:id')
  @ApiOperation({ summary: 'Update product by ID' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  // Bearer auth disabled
  // // // Auth disabled for development) // Disabled for development
  async updateProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    return this.catalogManagementService.updateProduct(id, updateProductDto);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete product by ID' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  // Bearer auth disabled
  // // // Auth disabled for development) // Disabled for development
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.catalogManagementService.deleteProduct(id);
  }
}