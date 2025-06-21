/**
 * Location Service for API Gateway
 * Handles branch location detection and management
 */

class LocationService {
  constructor(pool) {
    this.pool = pool;
  }

  async detectLocation(latitude, longitude) {
    try {
      const query = `
        SELECT 
          id,
          name,
          address,
          city,
          state,
          phone,
          ST_Distance(
            ST_SetSRID(ST_MakePoint(longitude, latitude), 4326),
            ST_SetSRID(ST_MakePoint($1, $2), 4326)
          ) as distance
        FROM branches 
        WHERE is_active = true
        ORDER BY distance
        LIMIT 5
      `;
      
      const result = await this.pool.query(query, [longitude, latitude]);
      return result.rows;
    } catch (error) {
      console.error('Location detection error:', error);
      return [];
    }
  }

  async getNearbyBranches(latitude, longitude, radius = 10000) {
    try {
      const query = `
        SELECT 
          id,
          name,
          address,
          city,
          state,
          phone,
          operating_hours,
          services_offered,
          ST_Distance(
            ST_SetSRID(ST_MakePoint(longitude, latitude), 4326),
            ST_SetSRID(ST_MakePoint($1, $2), 4326)
          ) as distance
        FROM branches 
        WHERE is_active = true
        AND ST_DWithin(
          ST_SetSRID(ST_MakePoint(longitude, latitude), 4326),
          ST_SetSRID(ST_MakePoint($1, $2), 4326),
          $3
        )
        ORDER BY distance
      `;
      
      const result = await this.pool.query(query, [longitude, latitude, radius]);
      return result.rows;
    } catch (error) {
      console.error('Nearby branches error:', error);
      return [];
    }
  }

  async getAllBranches() {
    try {
      const query = `
        SELECT 
          id,
          name,
          address,
          city,
          state,
          phone,
          operating_hours,
          services_offered,
          is_active
        FROM branches 
        ORDER BY name
      `;
      
      const result = await this.pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Get all branches error:', error);
      return [];
    }
  }

  async logLocationAccess(userId, latitude, longitude, branchId) {
    try {
      const query = `
        INSERT INTO location_logs (user_id, latitude, longitude, branch_id, accessed_at)
        VALUES ($1, $2, $3, $4, NOW())
      `;
      
      await this.pool.query(query, [userId, latitude, longitude, branchId]);
    } catch (error) {
      console.error('Location logging error:', error);
    }
  }
}

module.exports = LocationService;