// Use standardized database connection
export { db, databaseConnection } from '../../../../shared/database/connection';
export * from '../../../../shared/schema';

console.log('🔗 Database connected to PostgreSQL');
// Database connection established via shared connection pool