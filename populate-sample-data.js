
const { Pool } = require('pg');

// Database connection with better error handling
const getConnectionString = () => {
  // Try different environment variables in order of preference
  const possibleUrls = [
    process.env.DATABASE_URL,
    process.env.REPLIT_DB_URL,
    process.env.POSTGRES_URL,
    'postgresql://postgres:leafyhealth2024@localhost:5432/leafyhealth'
  ];
  
  for (const url of possibleUrls) {
    if (url && url.trim() !== '' && !url.includes('kv.replit.com')) {
      console.log(`🔍 Using database URL: ${url.substring(0, 20)}...`);
      return url;
    }
  }
  
  throw new Error('No valid PostgreSQL database URL found');
};

const sampleData = {
  // Companies
  companies: [
    {
      id: 'comp1111-1111-1111-1111-111111111111',
      name: 'Sri Venkateswara Organic Foods',
      business_type: 'retail',
      registration_number: 'SVF2024001',
      email: 'contact@svorganicfoods.com',
      phone: '+91 9876543210',
      address: 'Jubilee Hills, Hyderabad',
      is_active: true
    }
  ],

  // Branches
  branches: [
    {
      id: 'branch11-1111-1111-1111-111111111111',
      company_id: 'comp1111-1111-1111-1111-111111111111',
      name: 'Jubilee Hills Branch',
      branch_code: 'JH001',
      address: 'Road No. 36, Jubilee Hills, Hyderabad',
      phone: '+91 9876543211',
      manager_name: 'Rajesh Kumar',
      is_active: true
    },
    {
      id: 'branch22-2222-2222-2222-222222222222',
      company_id: 'comp1111-1111-1111-1111-111111111111',
      name: 'Banjara Hills Branch',
      branch_code: 'BH001',
      address: 'Road No. 12, Banjara Hills, Hyderabad',
      phone: '+91 9876543212',
      manager_name: 'Priya Sharma',
      is_active: true
    }
  ],

  // Categories
  categories: [
    {
      id: 'cat11111-1111-1111-1111-111111111111',
      name: 'Vegetables',
      name_telugu: 'కూరగాయలు',
      description: 'Fresh organic vegetables',
      parent_id: null,
      is_active: true
    },
    {
      id: 'cat22222-2222-2222-2222-222222222222',
      name: 'Fruits',
      name_telugu: 'పండ్లు',
      description: 'Fresh seasonal fruits',
      parent_id: null,
      is_active: true
    },
    {
      id: 'cat33333-3333-3333-3333-333333333333',
      name: 'Grains & Pulses',
      name_telugu: 'ధాన్యాలు మరియు పప్పులు',
      description: 'Organic grains and pulses',
      parent_id: null,
      is_active: true
    }
  ],

  // Products
  products: [
    {
      id: 'prod1111-1111-1111-1111-111111111111',
      name: 'Organic Spinach',
      name_telugu: 'పాలకూర',
      description: 'Fresh organic spinach leaves',
      category_id: 'cat11111-1111-1111-1111-111111111111',
      sku: 'VEG-SPN-001',
      base_price: 25.00,
      selling_price: 30.00,
      unit_quantity: 250,
      unit_type: 'grams',
      stock_quantity: 100,
      is_organic: true,
      is_seasonal: false,
      tags: '["organic", "leafy", "vegetable"]',
      slug: 'organic-spinach'
    },
    {
      id: 'prod2222-2222-2222-2222-222222222222',
      name: 'Organic Tomatoes',
      name_telugu: 'టమాటో',
      description: 'Fresh red organic tomatoes',
      category_id: 'cat11111-1111-1111-1111-111111111111',
      sku: 'VEG-TOM-001',
      base_price: 40.00,
      selling_price: 50.00,
      unit_quantity: 500,
      unit_type: 'grams',
      stock_quantity: 80,
      is_organic: true,
      is_seasonal: false,
      tags: '["organic", "red", "vegetable"]',
      slug: 'organic-tomatoes'
    },
    {
      id: 'prod3333-3333-3333-3333-333333333333',
      name: 'Organic Rice',
      name_telugu: 'బియ్యం',
      description: 'Premium organic basmati rice',
      category_id: 'cat33333-3333-3333-3333-333333333333',
      sku: 'GRN-RIC-001',
      base_price: 80.00,
      selling_price: 100.00,
      unit_quantity: 1,
      unit_type: 'kg',
      stock_quantity: 50,
      is_organic: true,
      is_seasonal: false,
      tags: '["organic", "basmati", "grain"]',
      slug: 'organic-rice'
    }
  ],

  // Users
  users: [
    {
      id: 'user1111-1111-1111-1111-111111111111',
      email: 'admin@leafyhealth.com',
      username: 'admin',
      password_hash: '$2b$10$hash123456789',
      name: 'System Administrator',
      role: 'admin',
      is_active: true
    },
    {
      id: 'user2222-2222-2222-2222-222222222222',
      email: 'customer@example.com',
      username: 'customer1',
      password_hash: '$2b$10$hash123456789',
      name: 'Rajesh Kumar',
      role: 'customer',
      is_active: true
    },
    {
      id: 'user3333-3333-3333-3333-333333333333',
      email: 'employee@leafyhealth.com',
      username: 'employee1',
      password_hash: '$2b$10$hash123456789',
      name: 'Priya Sharma',
      role: 'employee',
      is_active: true
    }
  ],

  // Orders
  orders: [
    {
      id: 'order111-1111-1111-1111-111111111111',
      order_number: 'LH-2025-001',
      user_id: 'user2222-2222-2222-2222-222222222222',
      branch_id: 'branch11-1111-1111-1111-111111111111',
      status: 'completed',
      payment_status: 'paid',
      subtotal: 150.00,
      total_amount: 150.00,
      delivery_address: '{"name": "Rajesh Kumar", "phone": "+91 9876543212", "address": "H.No 123, Jubilee Hills", "city": "Hyderabad", "state": "Telangana", "pincode": "500033"}'
    },
    {
      id: 'order222-2222-2222-2222-222222222222',
      order_number: 'LH-2025-002',
      user_id: 'user2222-2222-2222-2222-222222222222',
      branch_id: 'branch22-2222-2222-2222-222222222222',
      status: 'processing',
      payment_status: 'pending',
      subtotal: 250.00,
      total_amount: 250.00,
      delivery_address: '{"name": "Rajesh Kumar", "phone": "+91 9876543212", "address": "H.No 456, Banjara Hills", "city": "Hyderabad", "state": "Telangana", "pincode": "500034"}'
    }
  ],

  // Order Items
  orderItems: [
    {
      order_id: 'order111-1111-1111-1111-111111111111',
      product_id: 'prod1111-1111-1111-1111-111111111111',
      quantity: 2,
      unit_price: 30.00,
      total_price: 60.00
    },
    {
      order_id: 'order111-1111-1111-1111-111111111111',
      product_id: 'prod2222-2222-2222-2222-222222222222',
      quantity: 2,
      unit_price: 50.00,
      total_price: 100.00
    },
    {
      order_id: 'order222-2222-2222-2222-222222222222',
      product_id: 'prod3333-3333-3333-3333-333333333333',
      quantity: 2,
      unit_price: 100.00,
      total_price: 200.00
    }
  ],

  // Inventory
  inventory: [
    {
      product_id: 'prod1111-1111-1111-1111-111111111111',
      branch_id: 'branch11-1111-1111-1111-111111111111',
      quantity: 50,
      reserved_quantity: 0,
      reorder_level: 10,
      max_stock_level: 100
    },
    {
      product_id: 'prod2222-2222-2222-2222-222222222222',
      branch_id: 'branch11-1111-1111-1111-111111111111',
      quantity: 40,
      reserved_quantity: 0,
      reorder_level: 15,
      max_stock_level: 80
    },
    {
      product_id: 'prod3333-3333-3333-3333-333333333333',
      branch_id: 'branch22-2222-2222-2222-222222222222',
      quantity: 25,
      reserved_quantity: 0,
      reorder_level: 5,
      max_stock_level: 50
    }
  ]
};

async function testDatabaseConnection() {
  const connectionString = getConnectionString();
  const pool = new Pool({ 
    connectionString,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 1
  });
  
  try {
    console.log('🔍 Testing database connection...');
    const client = await pool.connect();
    
    // Test connection
    const result = await client.query('SELECT NOW() as current_time, version() as version');
    console.log('✅ Database connection successful');
    console.log(`📅 Current time: ${result.rows[0].current_time}`);
    console.log(`🐘 PostgreSQL version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);
    
    client.release();
    await pool.end();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('📝 Make sure PostgreSQL is running and properly configured');
    await pool.end();
    return false;
  }
}

async function createTablesIfNotExist(client) {
  console.log('🏗️ Creating tables if they don\'t exist...');
  
  const createTablesSQL = `
    -- Create companies table
    CREATE TABLE IF NOT EXISTS companies (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      business_type VARCHAR(100),
      registration_number VARCHAR(100),
      email VARCHAR(255),
      phone VARCHAR(50),
      address TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Create branches table
    CREATE TABLE IF NOT EXISTS branches (
      id VARCHAR(255) PRIMARY KEY,
      company_id VARCHAR(255) REFERENCES companies(id),
      name VARCHAR(255) NOT NULL,
      branch_code VARCHAR(50),
      address TEXT,
      phone VARCHAR(50),
      manager_name VARCHAR(255),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Create categories table
    CREATE TABLE IF NOT EXISTS categories (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      name_telugu VARCHAR(255),
      description TEXT,
      parent_id VARCHAR(255) REFERENCES categories(id),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Create products table
    CREATE TABLE IF NOT EXISTS products (
      id VARCHAR(255) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      name_telugu VARCHAR(255),
      description TEXT,
      category_id VARCHAR(255) REFERENCES categories(id),
      sku VARCHAR(100) UNIQUE,
      base_price DECIMAL(10,2),
      selling_price DECIMAL(10,2),
      unit_quantity INTEGER,
      unit_type VARCHAR(50),
      stock_quantity INTEGER DEFAULT 0,
      is_organic BOOLEAN DEFAULT false,
      is_seasonal BOOLEAN DEFAULT false,
      tags TEXT,
      slug VARCHAR(255),
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Create users table
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(255) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      username VARCHAR(100) UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      role VARCHAR(50) DEFAULT 'customer',
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Create orders table
    CREATE TABLE IF NOT EXISTS orders (
      id VARCHAR(255) PRIMARY KEY,
      order_number VARCHAR(100) UNIQUE NOT NULL,
      user_id VARCHAR(255) REFERENCES users(id),
      branch_id VARCHAR(255) REFERENCES branches(id),
      status VARCHAR(50) DEFAULT 'pending',
      payment_status VARCHAR(50) DEFAULT 'pending',
      subtotal DECIMAL(10,2),
      total_amount DECIMAL(10,2),
      delivery_address TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Create order_items table
    CREATE TABLE IF NOT EXISTS order_items (
      order_id VARCHAR(255) REFERENCES orders(id),
      product_id VARCHAR(255) REFERENCES products(id),
      quantity INTEGER NOT NULL,
      unit_price DECIMAL(10,2),
      total_price DECIMAL(10,2),
      PRIMARY KEY (order_id, product_id)
    );

    -- Create inventory table
    CREATE TABLE IF NOT EXISTS inventory (
      product_id VARCHAR(255) REFERENCES products(id),
      branch_id VARCHAR(255) REFERENCES branches(id),
      quantity INTEGER DEFAULT 0,
      reserved_quantity INTEGER DEFAULT 0,
      reorder_level INTEGER DEFAULT 0,
      max_stock_level INTEGER DEFAULT 0,
      last_updated TIMESTAMP DEFAULT NOW(),
      PRIMARY KEY (product_id, branch_id)
    );

    -- Create analytics_events table
    CREATE TABLE IF NOT EXISTS analytics_events (
      id SERIAL PRIMARY KEY,
      event_name VARCHAR(255) NOT NULL,
      user_id VARCHAR(255) REFERENCES users(id),
      event_data TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- Create notifications table
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) REFERENCES users(id),
      title VARCHAR(255) NOT NULL,
      message TEXT,
      type VARCHAR(50),
      is_read BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `;
  
  await client.query(createTablesSQL);
  console.log('✅ Tables created successfully');
}

async function populateDatabase() {
  // Test connection first
  const isConnected = await testDatabaseConnection();
  if (!isConnected) {
    console.error('❌ Cannot proceed without database connection');
    process.exit(1);
  }

  const connectionString = getConnectionString();
  const pool = new Pool({ 
    connectionString,
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    max: 5
  });
  
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting database population...');
    
    // Create tables first
    await createTablesIfNotExist(client);
    
    // Clear existing data (optional - remove if you want to keep existing data)
    console.log('🧹 Clearing existing sample data...');
    await client.query('DELETE FROM order_items WHERE 1=1');
    await client.query('DELETE FROM orders WHERE order_number LIKE \'LH-2025-%\'');
    await client.query('DELETE FROM inventory WHERE 1=1');
    await client.query('DELETE FROM products WHERE sku LIKE \'VEG-%\' OR sku LIKE \'GRN-%\'');
    await client.query('DELETE FROM categories WHERE name IN (\'Vegetables\', \'Fruits\', \'Grains & Pulses\')');
    await client.query('DELETE FROM branches WHERE company_id = \'comp1111-1111-1111-1111-111111111111\'');
    await client.query('DELETE FROM companies WHERE name = \'Sri Venkateswara Organic Foods\'');
    await client.query('DELETE FROM users WHERE email IN (\'admin@leafyhealth.com\', \'customer@example.com\', \'employee@leafyhealth.com\')');
    
    // Companies
    console.log('📊 Inserting companies...');
    for (const company of sampleData.companies) {
      await client.query(`
        INSERT INTO companies (id, name, business_type, registration_number, email, phone, address, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      `, [company.id, company.name, company.business_type, company.registration_number, company.email, company.phone, company.address, company.is_active]);
    }
    
    // Branches
    console.log('🏪 Inserting branches...');
    for (const branch of sampleData.branches) {
      await client.query(`
        INSERT INTO branches (id, company_id, name, branch_code, address, phone, manager_name, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      `, [branch.id, branch.company_id, branch.name, branch.branch_code, branch.address, branch.phone, branch.manager_name, branch.is_active]);
    }
    
    // Categories
    console.log('📂 Inserting categories...');
    for (const category of sampleData.categories) {
      await client.query(`
        INSERT INTO categories (id, name, name_telugu, description, parent_id, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      `, [category.id, category.name, category.name_telugu, category.description, category.parent_id, category.is_active]);
    }
    
    // Products
    console.log('🥬 Inserting products...');
    for (const product of sampleData.products) {
      await client.query(`
        INSERT INTO products (id, name, name_telugu, description, category_id, sku, base_price, selling_price, unit_quantity, unit_type, stock_quantity, is_organic, is_seasonal, tags, slug, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, true, NOW(), NOW())
      `, [product.id, product.name, product.name_telugu, product.description, product.category_id, product.sku, product.base_price, product.selling_price, product.unit_quantity, product.unit_type, product.stock_quantity, product.is_organic, product.is_seasonal, product.tags, product.slug]);
    }
    
    // Users
    console.log('👥 Inserting users...');
    for (const user of sampleData.users) {
      await client.query(`
        INSERT INTO users (id, email, username, password_hash, name, role, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      `, [user.id, user.email, user.username, user.password_hash, user.name, user.role, user.is_active]);
    }
    
    // Orders
    console.log('🛒 Inserting orders...');
    for (const order of sampleData.orders) {
      await client.query(`
        INSERT INTO orders (id, order_number, user_id, branch_id, status, payment_status, subtotal, total_amount, delivery_address, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      `, [order.id, order.order_number, order.user_id, order.branch_id, order.status, order.payment_status, order.subtotal, order.total_amount, order.delivery_address]);
    }
    
    // Order Items
    console.log('📝 Inserting order items...');
    for (const item of sampleData.orderItems) {
      await client.query(`
        INSERT INTO order_items (order_id, product_id, quantity, unit_price, total_price)
        VALUES ($1, $2, $3, $4, $5)
      `, [item.order_id, item.product_id, item.quantity, item.unit_price, item.total_price]);
    }
    
    // Inventory
    console.log('📦 Inserting inventory...');
    for (const inv of sampleData.inventory) {
      await client.query(`
        INSERT INTO inventory (product_id, branch_id, quantity, reserved_quantity, reorder_level, max_stock_level, last_updated)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
      `, [inv.product_id, inv.branch_id, inv.quantity, inv.reserved_quantity, inv.reorder_level, inv.max_stock_level]);
    }
    
    // Add some analytics events
    console.log('📊 Inserting analytics events...');
    await client.query(`
      INSERT INTO analytics_events (event_name, user_id, event_data, created_at)
      VALUES 
        ('page_view', 'user2222-2222-2222-2222-222222222222', '{"page": "/products", "category": "vegetables"}', NOW()),
        ('product_view', 'user2222-2222-2222-2222-222222222222', '{"product_id": "prod1111-1111-1111-1111-111111111111"}', NOW()),
        ('order_placed', 'user2222-2222-2222-2222-222222222222', '{"order_id": "order111-1111-1111-1111-111111111111", "amount": 150.00}', NOW())
    `);
    
    // Add notifications
    console.log('🔔 Inserting notifications...');
    await client.query(`
      INSERT INTO notifications (user_id, title, message, type, is_read, created_at)
      VALUES 
        ('user2222-2222-2222-2222-222222222222', 'Order Confirmed', 'Your order LH-2025-001 has been confirmed', 'order', false, NOW()),
        ('user2222-2222-2222-2222-222222222222', 'Welcome to LeafyHealth', 'Thank you for joining our organic food family!', 'welcome', true, NOW())
    `);
    
    // Verify data was inserted
    console.log('\n📈 Verifying inserted data...');
    const companiesCount = await client.query('SELECT COUNT(*) FROM companies');
    const branchesCount = await client.query('SELECT COUNT(*) FROM branches');
    const categoriesCount = await client.query('SELECT COUNT(*) FROM categories');
    const productsCount = await client.query('SELECT COUNT(*) FROM products');
    const usersCount = await client.query('SELECT COUNT(*) FROM users');
    const ordersCount = await client.query('SELECT COUNT(*) FROM orders');
    const orderItemsCount = await client.query('SELECT COUNT(*) FROM order_items');
    const inventoryCount = await client.query('SELECT COUNT(*) FROM inventory');
    const analyticsCount = await client.query('SELECT COUNT(*) FROM analytics_events');
    const notificationsCount = await client.query('SELECT COUNT(*) FROM notifications');
    
    console.log('✅ Database populated successfully!');
    console.log('📈 Summary:');
    console.log(`  • ${companiesCount.rows[0].count} companies`);
    console.log(`  • ${branchesCount.rows[0].count} branches`);
    console.log(`  • ${categoriesCount.rows[0].count} categories`);
    console.log(`  • ${productsCount.rows[0].count} products`);
    console.log(`  • ${usersCount.rows[0].count} users`);
    console.log(`  • ${ordersCount.rows[0].count} orders`);
    console.log(`  • ${orderItemsCount.rows[0].count} order items`);
    console.log(`  • ${inventoryCount.rows[0].count} inventory entries`);
    console.log(`  • ${analyticsCount.rows[0].count} analytics events`);
    console.log(`  • ${notificationsCount.rows[0].count} notifications`);
    
  } catch (error) {
    console.error('❌ Error populating database:', error);
    console.error('Stack trace:', error.stack);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the population script
populateDatabase()
  .then(() => {
    console.log('🎉 Sample data population completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Sample data population failed:', error.message);
    process.exit(1);
  });
