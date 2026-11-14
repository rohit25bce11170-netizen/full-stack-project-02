/**
 * In-Memory Data Store for Users
 * Follows Phase 2 separation of concerns: simple, clean in-memory persistence layer.
 */

class UserStore {
  constructor() {
    this.users = [];
    this.currentId = 1;
    this.seedInitialData();
  }

  seedInitialData() {
    const seedRecords = [
      {
        name: 'Aarav Sharma',
        email: 'aarav.sharma@example.com',
        role: 'admin',
        status: 'active'
      },
      {
        name: 'Diya Patel',
        email: 'diya.patel@example.com',
        role: 'user',
        status: 'active'
      },
      {
        name: 'Rohan Mehta',
        email: 'rohan.mehta@example.com',
        role: 'manager',
        status: 'inactive'
      }
    ];

    const timestamp = new Date().toISOString();
    seedRecords.forEach((record) => {
      this.users.push({
        id: this.currentId++,
        ...record,
        createdAt: timestamp,
        updatedAt: timestamp
      });
    });
  }

  /**
   * Retrieve all users, optionally filtered
   * @param {Object} [filter={}] - Filter criteria (e.g. role, status)
   * @returns {Array} List of users
   */
  findAll(filter = {}) {
    let result = [...this.users];

    if (filter.role) {
      result = result.filter(u => u.role.toLowerCase() === filter.role.toLowerCase());
    }
    if (filter.status) {
      result = result.filter(u => u.status.toLowerCase() === filter.status.toLowerCase());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(u => 
        u.name.toLowerCase().includes(q) || 
        u.email.toLowerCase().includes(q)
      );
    }

    return result;
  }

  /**
   * Find user by ID
   * @param {number} id 
   * @returns {Object|null}
   */
  findById(id) {
    const numericId = parseInt(id, 10);
    return this.users.find(u => u.id === numericId) || null;
  }

  /**
   * Find user by Email (case-insensitive)
   * @param {string} email 
   * @returns {Object|null}
   */
  findByEmail(email) {
    if (!email) return null;
    return this.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase()) || null;
  }

  /**
   * Create new user record
   * @param {Object} userData 
   * @returns {Object} Created user
   */
  create(userData) {
    const now = new Date().toISOString();
    const newUser = {
      id: this.currentId++,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      role: userData.role || 'user',
      status: userData.status || 'active',
      createdAt: now,
      updatedAt: now
    };

    this.users.push(newUser);
    return newUser;
  }

  /**
   * Update existing user by ID (PUT replacement / update)
   * @param {number} id 
   * @param {Object} updateData 
   * @returns {Object|null}
   */
  update(id, updateData) {
    const numericId = parseInt(id, 10);
    const index = this.users.findIndex(u => u.id === numericId);
    if (index === -1) return null;

    const existing = this.users[index];
    const updatedUser = {
      ...existing,
      name: updateData.name !== undefined ? updateData.name.trim() : existing.name,
      email: updateData.email !== undefined ? updateData.email.trim().toLowerCase() : existing.email,
      role: updateData.role !== undefined ? updateData.role : existing.role,
      status: updateData.status !== undefined ? updateData.status : existing.status,
      updatedAt: new Date().toISOString()
    };

    this.users[index] = updatedUser;
    return updatedUser;
  }

  /**
   * Delete user by ID
   * @param {number} id 
   * @returns {boolean} true if deleted, false if not found
   */
  delete(id) {
    const numericId = parseInt(id, 10);
    const index = this.users.findIndex(u => u.id === numericId);
    if (index === -1) return false;

    this.users.splice(index, 1);
    return true;
  }

  /**
   * Reset store (useful for tests)
   */
  reset() {
    this.users = [];
    this.currentId = 1;
    this.seedInitialData();
  }
}

// Export singleton instance
module.exports = new UserStore();
