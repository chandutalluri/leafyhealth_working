
const { Client } = require('pg');

async function populateBranchProducts() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  
  try {
    await client.connect();
    console.log('🔗 Connected to database');

    // Get all branches
    const branchesResult = await client.query('SELECT id, name FROM branches WHERE is_active = true');
    const branches = branchesResult.rows;
    console.log(`📍 Found ${branches.length} active branches`);

    // Get all products
    const productsResult = await client.query('SELECT id, name, price FROM products WHERE is_active = true');
    const products = productsResult.rows;
    console.log(`📦 Found ${products.length} active products`);

    if (branches.length === 0 || products.length === 0) {
      console.log('❌ No branches or products found. Please ensure your database has sample data.');
      return;
    }

    // Clear existing branch_products relationships
    await client.query('DELETE FROM branch_products');
    console.log('🗑️ Cleared existing branch-product relationships');

    // Assign products to branches with some variation
    for (const branch of branches) {
      console.log(`\n🏪 Processing branch: ${branch.name}`);
      
      for (const product of products) {
        // Randomly assign 70-90% of products to each branch
        const shouldAssign = Math.random() > 0.2; // 80% chance
        
        if (shouldAssign) {
          // Add some price variation per branch (+/- 10%)
          const priceVariation = (Math.random() - 0.5) * 0.2; // -10% to +10%
          const branchPrice = parseFloat(product.price) * (1 + priceVariation);
          const stockQuantity = Math.floor(Math.random() * 100) + 10; // 10-110 stock
          
          try {
            await client.query(`
              INSERT INTO branch_products (branch_id, product_id, price, stock_quantity, is_available, created_at, updated_at)
              VALUES ($1, $2, $3, $4, true, NOW(), NOW())
              ON CONFLICT (branch_id, product_id) DO UPDATE SET
                price = EXCLUDED.price,
                stock_quantity = EXCLUDED.stock_quantity,
                updated_at = NOW()
            `, [branch.id, product.id, branchPrice.toFixed(2), stockQuantity]);
            
            console.log(`  ✅ ${product.name} - ₹${branchPrice.toFixed(2)} (Stock: ${stockQuantity})`);
          } catch (error) {
            console.log(`  ❌ Failed to assign ${product.name}: ${error.message}`);
          }
        }
      }
    }

    // Show summary
    const summaryResult = await client.query(`
      SELECT b.name as branch_name, COUNT(bp.id) as product_count
      FROM branches b
      LEFT JOIN branch_products bp ON b.id = bp.branch_id
      WHERE b.is_active = true
      GROUP BY b.id, b.name
      ORDER BY product_count DESC
    `);

    console.log('\n📊 Branch-Product Summary:');
    summaryResult.rows.forEach(row => {
      console.log(`  ${row.branch_name}: ${row.product_count} products`);
    });

    console.log('\n✅ Branch-product relationships populated successfully!');

  } catch (error) {
    console.error('❌ Error populating branch products:', error);
  } finally {
    await client.end();
  }
}

// Run if called directly
if (require.main === module) {
  populateBranchProducts().catch(console.error);
}

module.exports = { populateBranchProducts };
