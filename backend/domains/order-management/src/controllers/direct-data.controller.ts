
import { Controller, Get } from '@nestjs/common';
import { Pool } from 'pg';

@Controller('direct-data')
export class DirectDataController {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  @Get('orders')
  async getOrders() {
    try {
      const result = await this.pool.query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 50');
      return result.rows;
    } catch (error) {
      return [];
    }
  }

  @Get('products')
  async getProducts() {
    try {
      const result = await this.pool.query('SELECT * FROM products ORDER BY created_at DESC LIMIT 100');
      return result.rows;
    } catch (error) {
      return [];
    }
  }

  @Get('inventory')
  async getInventory() {
    try {
      const result = await this.pool.query('SELECT * FROM inventory ORDER BY created_at DESC LIMIT 100');
      return result.rows;
    } catch (error) {
      return [];
    }
  }
}
