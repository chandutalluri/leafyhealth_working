# Complete LeafyHealth Database Restore Instructions

## Overview
This document provides comprehensive instructions for restoring the complete LeafyHealth database from the production-ready backup files. The database contains 78 tables with complete sample data including 25+ products, 8 categories, 5 users, 5 orders, 5 companies, and 5 branches.

## Database Files
- **PRODUCTION_LEAFYHEALTH_DATABASE_COMPLETE.sql** - Legacy backup (maintained for compatibility)
- **PRODUCTION_LEAFYHEALTH_DATABASE_COMPLETE_NEW.sql** - Latest complete backup with enhanced structure

## Prerequisites
- PostgreSQL 12+ (Recommended: PostgreSQL 15+)
- Minimum 1GB available disk space
- Administrative access to PostgreSQL server
- pgAdmin, psql command line, or equivalent database client

## Restoration Methods

### Method 1: Using psql Command Line (Recommended)

```bash
# 1. Create a new database
createdb leafyhealth_production

# 2. Restore from the complete backup
psql -d leafyhealth_production -f PRODUCTION_LEAFYHEALTH_DATABASE_COMPLETE_NEW.sql

# 3. Verify restoration
psql -d leafyhealth_production -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"
```

### Method 2: Using pgAdmin

1. **Create Database**
   - Right-click on "Databases" in pgAdmin
   - Select "Create" > "Database"
   - Name: `leafyhealth_production`
   - Encoding: UTF8

2. **Restore Data**
   - Right-click on the new database
   - Select "Query Tool"
   - Open file: `PRODUCTION_LEAFYHEALTH_DATABASE_COMPLETE_NEW.sql`
   - Execute the script (F5)

3. **Verify Tables**
   - Refresh the database tree
   - Confirm 78+ tables are present
   - Check sample data in key tables

### Method 3: Using Docker PostgreSQL

```bash
# 1. Start PostgreSQL container
docker run --name leafyhealth-db -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres:15

# 2. Copy backup file to container
docker cp PRODUCTION_LEAFYHEALTH_DATABASE_COMPLETE_NEW.sql leafyhealth-db:/backup.sql

# 3. Create database and restore
docker exec -it leafyhealth-db createdb -U postgres leafyhealth_production
docker exec -it leafyhealth-db psql -U postgres -d leafyhealth_production -f /backup.sql
```

## Post-Restoration Verification

Execute these commands to verify successful restoration:

```sql
-- Check total table count (should be 78+)
SELECT COUNT(*) as total_tables FROM information_schema.tables WHERE table_schema = 'public';

-- Verify core business data
SELECT 
  (SELECT COUNT(*) FROM companies) as companies,
  (SELECT COUNT(*) FROM branches) as branches,
  (SELECT COUNT(*) FROM categories) as categories,
  (SELECT COUNT(*) FROM products) as products,
  (SELECT COUNT(*) FROM users) as users,
  (SELECT COUNT(*) FROM orders) as orders;

-- Check foreign key relationships
SELECT 
  tc.table_name,
  COUNT(kcu.column_name) as foreign_key_count
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
GROUP BY tc.table_name
ORDER BY foreign_key_count DESC;
```

Expected results:
- **Total Tables:** 78+
- **Companies:** 5
- **Branches:** 5
- **Categories:** 8
- **Products:** 25+
- **Users:** 5
- **Orders:** 5

## Troubleshooting

### Common Issues

1. **Permission Denied**
   ```bash
   # Grant permissions to database user
   GRANT ALL PRIVILEGES ON DATABASE leafyhealth_production TO your_user;
   ```

2. **Encoding Issues**
   ```bash
   # Create database with UTF8 encoding
   createdb -E UTF8 leafyhealth_production
   ```

3. **Extension Not Found**
   ```bash
   # Install required PostgreSQL extensions
   sudo apt-get install postgresql-contrib
   ```

## Platform-Specific Instructions

### Supabase
1. Create new project in Supabase dashboard
2. Use SQL Editor to execute the backup script
3. Enable RLS if required

### AWS RDS
1. Create PostgreSQL instance
2. Connect using psql with RDS endpoint
3. Run restoration commands

### Heroku Postgres
```bash
# Using Heroku CLI
heroku pg:psql DATABASE_URL --app your-app-name < PRODUCTION_LEAFYHEALTH_DATABASE_COMPLETE_NEW.sql
```

### Railway
1. Create PostgreSQL service
2. Connect using provided connection string
3. Execute restoration script

## Security Considerations
- Change default passwords after restoration
- Review user permissions and roles
- Enable SSL connections in production
- Configure proper firewall rules
- Regular backup schedule recommended

## Business Data Overview

### Sri Venkateswara Organic Foods
The database contains authentic Telugu organic food business data:

- **Product Categories:** Vegetables, Fruits, Grains & Cereals, Pulses & Lentils, Spices & Herbs, Dairy Products, Oils & Ghee, Snacks & Sweets
- **Geographic Coverage:** Hyderabad, Telangana with multiple branch locations
- **Authentic Telugu Names:** All products include Telugu translations
- **Complete Pricing:** Realistic market prices in Indian Rupees
- **Inventory Management:** Stock levels and branch-wise availability
- **Order Processing:** Complete order lifecycle with payment tracking

## Technical Specifications

### Database Features
- UUID-based primary keys for scalability
- Foreign key constraints for data integrity
- Performance-optimized indexes
- JSON/JSONB support for flexible data
- Geographic data support with latitude/longitude
- Full-text search capabilities
- Timestamp tracking for audit trails
- Role-based access control

### Microservice Support
The database schema supports all 24 microservices including:
- Authentication & Authorization
- Product Catalog Management
- Order Processing
- Payment Processing
- Inventory Management
- Analytics & Reporting
- Notification System
- User Management
- Branch Management
- Subscription Management

This comprehensive backup ensures zero data loss and complete business continuity across all platform components.