// Set environment variables for tests before any modules are loaded
process.env.NODE_ENV = 'test';
process.env.DB_PATH = ':memory:';
process.env.ADMIN_PASSWORD = 'admin123';
process.env.RESELLER_DEFAULT_PASSWORD = 'demo123';
process.env.CLIENT_DEFAULT_PASSWORD = 'demo123';
process.env.JWT_SECRET = 'test_secret_123'; // Ensure JWT secret is consistent
