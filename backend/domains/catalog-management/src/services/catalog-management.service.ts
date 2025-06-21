import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/connection';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateProductDto,
  UpdateProductDto,
} from '../dto/catalog-management.dto';
import { eq, desc, like, and, isNull } from 'drizzle-orm';
import { categories, products } from '../../../../../shared/schema';

@Injectable()
export class CatalogManagementService {
  constructor(private readonly databaseService: DatabaseService) {}

  // Category Methods
  async createCategory(createCategoryDto: CreateCategoryDto) {
    const db = this.databaseService.getDatabase();
    
    const result = await db.insert(categories).values({
      name: createCategoryDto.name,
      description: createCategoryDto.description,
      parentId: createCategoryDto.parentId,
      imageUrl: createCategoryDto.imageUrl,
    }).returning();

    return {
      success: true,
      data: result[0],
      message: 'Category created successfully'
    };
  }

  async getAllCategories() {
    const db = this.databaseService.getDatabase();
    const allCategories = await db.select().from(categories).orderBy(desc(categories.createdAt));
    
    return {
      success: true,
      data: allCategories,
      count: allCategories.length
    };
  }

  async getCategoryById(id: number) {
    const db = this.databaseService.getDatabase();
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return {
      success: true,
      data: category
    };
  }

  async updateCategory(id: number, updateCategoryDto: UpdateCategoryDto) {
    const db = this.databaseService.getDatabase();
    
    const updateData: any = {
      updatedAt: new Date(),
    };
    
    if (updateCategoryDto.name) updateData.name = updateCategoryDto.name;
    if (updateCategoryDto.description) updateData.description = updateCategoryDto.description;
    if (updateCategoryDto.parentId) updateData.parentId = updateCategoryDto.parentId;
    if (updateCategoryDto.imageUrl) updateData.imageUrl = updateCategoryDto.imageUrl;
    if (updateCategoryDto.isActive !== undefined) updateData.isActive = updateCategoryDto.isActive;
    
    const [updatedCategory] = await db
      .update(categories)
      .set(updateData)
      .where(eq(categories.id, id))
      .returning();

    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return {
      success: true,
      data: updatedCategory,
      message: 'Category updated successfully'
    };
  }

  async deleteCategory(id: number) {
    const db = this.databaseService.getDatabase();
    
    const deletedResult = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();
    
    const deletedCategory = deletedResult[0];

    if (!deletedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return {
      success: true,
      data: deletedCategory
    };
  }

  // Product Methods
  async createProduct(createProductDto: CreateProductDto) {
    const db = this.databaseService.getDatabase();
    
    const [product] = await db.insert(products).values({
      name: createProductDto.name,
      description: createProductDto.description,
      sku: createProductDto.sku,
      price: createProductDto.price.toString(),
      costPrice: createProductDto.costPrice?.toString(),
      categoryId: createProductDto.categoryId,
      tags: createProductDto.tags,
      images: createProductDto.images,
      unit: createProductDto.unit,
      weight: createProductDto.weight?.toString(),
      barcode: createProductDto.barcode,
    }).returning();

    return {
      success: true,
      data: product,
      message: 'Product created successfully'
    };
  }

  async getAllProducts() {
    const db = this.databaseService.getDatabase();
    const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
    
    return {
      success: true,
      data: allProducts,
      count: allProducts.length
    };
  }

  async getProductById(id: number) {
    const db = this.databaseService.getDatabase();
    const [product] = await db.select().from(products).where(eq(products.id, id));
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return {
      success: true,
      data: product
    };
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    const db = this.databaseService.getDatabase();
    
    const updateData: any = {
      updatedAt: new Date(),
    };
    
    if (updateProductDto.name) updateData.name = updateProductDto.name;
    if (updateProductDto.description) updateData.description = updateProductDto.description;
    if (updateProductDto.sku) updateData.sku = updateProductDto.sku;
    if (updateProductDto.price) updateData.price = updateProductDto.price.toString();
    if (updateProductDto.costPrice) updateData.costPrice = updateProductDto.costPrice.toString();
    if (updateProductDto.categoryId) updateData.categoryId = updateProductDto.categoryId;
    if (updateProductDto.tags) updateData.tags = updateProductDto.tags;
    if (updateProductDto.images) updateData.images = updateProductDto.images;
    if (updateProductDto.unit) updateData.unit = updateProductDto.unit;
    if (updateProductDto.weight) updateData.weight = updateProductDto.weight;
    if (updateProductDto.barcode) updateData.barcode = updateProductDto.barcode;
    if (updateProductDto.isActive !== undefined) updateData.isActive = updateProductDto.isActive;
    
    const [updatedProduct] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return {
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    };
  }

  async deleteProduct(id: number) {
    const db = this.databaseService.getDatabase();
    
    const [deletedProduct] = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();

    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return {
      success: true,
      data: deletedProduct
    };
  }

  async searchProducts(query: string) {
    const db = this.databaseService.getDatabase();
    
    const searchResults = await db
      .select()
      .from(products)
      .where(
        and(
          like(products.name, `%${query}%`),
          eq(products.isActive, true)
        )
      )
      .orderBy(desc(products.createdAt));

    return {
      success: true,
      data: searchResults,
      count: searchResults.length,
      query
    };
  }

  async getProductsByCategory(categoryId: number) {
    const db = this.databaseService.getDatabase();
    
    const categoryProducts = await db
      .select()
      .from(products)
      .where(
        and(
          eq(products.categoryId, categoryId),
          eq(products.isActive, true)
        )
      )
      .orderBy(desc(products.createdAt));

    return {
      success: true,
      data: categoryProducts,
      count: categoryProducts.length,
      categoryId
    };
  }

  async getCategoryHierarchy() {
    const db = this.databaseService.getDatabase();
    
    // Get root categories (no parent)
    const rootCategories = await db
      .select()
      .from(categories)
      .where(and(isNull(categories.parentId), eq(categories.isActive, true)))
      .orderBy(categories.name);

    // Get all categories for building hierarchy
    const allCategories = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(categories.name);

    // Build category tree
    const buildCategoryTree = (parentId: number | null) => {
      return allCategories
        .filter(cat => cat.parentId === parentId)
        .map(cat => ({
          ...cat,
          children: buildCategoryTree(cat.id)
        }));
    };

    const categoryTree = buildCategoryTree(null);

    return {
      success: true,
      data: categoryTree,
      count: categoryTree.length
    };
  }
}