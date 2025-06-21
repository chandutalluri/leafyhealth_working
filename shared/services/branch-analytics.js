/**
 * Branch Analytics Service
 * Provides branch-specific sales, revenue, and performance analytics
 */

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

/**
 * Get branch-specific sales analytics
 */
async function getBranchSalesAnalytics(branchId, dateRange = '30_days') {
  try {
    let dateFilter = '';
    switch (dateRange) {
      case '7_days':
        dateFilter = "AND o.created_at >= NOW() - INTERVAL '7 days'";
        break;
      case '30_days':
        dateFilter = "AND o.created_at >= NOW() - INTERVAL '30 days'";
        break;
      case '90_days':
        dateFilter = "AND o.created_at >= NOW() - INTERVAL '90 days'";
        break;
      case '1_year':
        dateFilter = "AND o.created_at >= NOW() - INTERVAL '1 year'";
        break;
    }

    const result = await pool.query(`
      SELECT 
        COUNT(o.id) as total_orders,
        SUM(o.total_amount) as total_revenue,
        AVG(o.total_amount) as average_order_value,
        COUNT(DISTINCT o.user_id) as unique_customers,
        COUNT(CASE WHEN o.status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN o.status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN o.status = 'cancelled' THEN 1 END) as cancelled_orders
      FROM orders o
      WHERE o.branch_id = $1 ${dateFilter}
    `, [branchId]);

    return {
      success: true,
      data: result.rows[0],
      branchId: branchId,
      dateRange: dateRange
    };
  } catch (error) {
    console.error('Branch sales analytics error:', error);
    return { success: false, error: 'Failed to fetch sales analytics' };
  }
}

/**
 * Get branch-specific product performance
 */
async function getBranchProductPerformance(branchId, limit = 10) {
  try {
    const result = await pool.query(`
      SELECT 
        p.id,
        p.name,
        p.sku,
        c.name as category_name,
        bp.price as branch_price,
        bp.stock_quantity,
        COALESCE(SUM(oi.quantity), 0) as total_sold,
        COALESCE(SUM(oi.total_price), 0) as total_revenue,
        COUNT(DISTINCT o.id) as order_count
      FROM products p
      JOIN branch_products bp ON p.id = bp.product_id
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN order_items oi ON p.id = oi.product_id
      LEFT JOIN orders o ON oi.order_id = o.id AND o.branch_id = bp.branch_id
      WHERE bp.branch_id = $1 AND bp.is_available = true
      GROUP BY p.id, p.name, p.sku, c.name, bp.price, bp.stock_quantity
      ORDER BY total_sold DESC, total_revenue DESC
      LIMIT $2
    `, [branchId, limit]);

    return {
      success: true,
      data: result.rows,
      branchId: branchId
    };
  } catch (error) {
    console.error('Branch product performance error:', error);
    return { success: false, error: 'Failed to fetch product performance' };
  }
}

/**
 * Get branch-specific customer analytics
 */
async function getBranchCustomerAnalytics(branchId) {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(DISTINCT c.id) as total_customers,
        COUNT(DISTINCT CASE WHEN o.created_at >= NOW() - INTERVAL '30 days' THEN c.id END) as active_customers_30d,
        AVG(c.total_orders) as avg_orders_per_customer,
        AVG(c.total_spent) as avg_spent_per_customer,
        COUNT(DISTINCT s.id) as active_subscriptions
      FROM customers c
      LEFT JOIN orders o ON c.user_id = o.user_id AND o.branch_id = $1
      LEFT JOIN subscriptions s ON c.id = s.customer_id AND s.branch_id = $1 AND s.status = 'active'
      WHERE c.branch_id = $1
    `, [branchId]);

    return {
      success: true,
      data: result.rows[0],
      branchId: branchId
    };
  } catch (error) {
    console.error('Branch customer analytics error:', error);
    return { success: false, error: 'Failed to fetch customer analytics' };
  }
}

/**
 * Get branch comparison data (for Super Admin)
 */
async function getAllBranchesComparison() {
  try {
    const result = await pool.query(`
      SELECT 
        b.id,
        b.name,
        b.address,
        COUNT(DISTINCT o.id) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as total_revenue,
        COUNT(DISTINCT c.id) as total_customers,
        COUNT(DISTINCT bp.product_id) as available_products,
        COUNT(DISTINCT s.id) as active_subscriptions
      FROM branches b
      LEFT JOIN orders o ON b.id = o.branch_id AND o.created_at >= NOW() - INTERVAL '30 days'
      LEFT JOIN customers c ON b.id = c.branch_id
      LEFT JOIN branch_products bp ON b.id = bp.branch_id AND bp.is_available = true
      LEFT JOIN subscriptions s ON b.id = s.branch_id AND s.status = 'active'
      WHERE b.is_active = true
      GROUP BY b.id, b.name, b.address
      ORDER BY total_revenue DESC
    `);

    return {
      success: true,
      data: result.rows
    };
  } catch (error) {
    console.error('Branch comparison error:', error);
    return { success: false, error: 'Failed to fetch branch comparison data' };
  }
}

/**
 * Get branch-specific financial summary
 */
async function getBranchFinancialSummary(branchId, dateRange = '30_days') {
  try {
    let dateFilter = '';
    switch (dateRange) {
      case '7_days':
        dateFilter = "AND created_at >= NOW() - INTERVAL '7 days'";
        break;
      case '30_days':
        dateFilter = "AND created_at >= NOW() - INTERVAL '30 days'";
        break;
      case '90_days':
        dateFilter = "AND created_at >= NOW() - INTERVAL '90 days'";
        break;
    }

    const paymentsResult = await pool.query(`
      SELECT 
        COUNT(*) as total_transactions,
        SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_received,
        SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) as pending_amount,
        SUM(CASE WHEN status = 'refunded' THEN amount ELSE 0 END) as refunded_amount,
        COUNT(CASE WHEN payment_method = 'upi' THEN 1 END) as upi_transactions,
        COUNT(CASE WHEN payment_method = 'card' THEN 1 END) as card_transactions,
        COUNT(CASE WHEN payment_method = 'cod' THEN 1 END) as cod_transactions
      FROM payments p
      JOIN orders o ON p.order_id = o.id
      WHERE o.branch_id = $1 ${dateFilter}
    `, [branchId]);

    return {
      success: true,
      data: paymentsResult.rows[0],
      branchId: branchId,
      dateRange: dateRange
    };
  } catch (error) {
    console.error('Branch financial summary error:', error);
    return { success: false, error: 'Failed to fetch financial summary' };
  }
}

module.exports = {
  getBranchSalesAnalytics,
  getBranchProductPerformance,
  getBranchCustomerAnalytics,
  getAllBranchesComparison,
  getBranchFinancialSummary
};