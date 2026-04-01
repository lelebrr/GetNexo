// Mock for better-sqlite3 to avoid native binding issues in tests
class Database {
  constructor(path) {
    this.path = path;
    this.inTransaction = false;
  }

  pragma(sql) {
    // Return mock table info if requested
    if (sql.includes('table_info')) {
      return [];
    }
    return [];
  }

  prepare(sql) {
    return {
      run: (...args) => ({ changes: 1, lastInsertRowid: 1 }),
      get: (...args) => {
        // Return a mock user for login if email is provided
        if (sql.includes('SELECT * FROM users') && !sql.includes('count(*)')) {
            return {
                id: 1,
                email: 'test@example.com',
                password: '$2a$10$hashedpassword', // bcrypt hash
                name: 'Test User',
                role: 'admin',
                role_id: 1
            };
        }
        if (sql.includes('SELECT id, email')) {
             return {
                id: 1,
                email: 'test@example.com',
                password: '$2a$10$hashedpassword', // bcrypt hash
                name: 'Test User',
                role: 'admin',
                role_id: 1
            };
        }
        if (sql.includes('count(*) as count')) {
            return { count: 0 };
        }
        // Specific user query
        if (sql.includes('WHERE email = ?')) {
             return {
                id: 1,
                email: 'test@example.com',
                password: '$2a$10$hashedpassword', // bcrypt hash
                name: 'Test User',
                role: 'admin',
                role_id: 1
            };
        }
        return null;
      },
      all: (...args) => [],
      iterate: function* () { yield {}; }
    };
  }

  transaction(fn) {
    return (...args) => {
      this.inTransaction = true;
      try {
        return fn(...args);
      } finally {
        this.inTransaction = false;
      }
    };
  }

  exec(sql) {
    // Do nothing
  }

  close() {}
}

module.exports = Database;
