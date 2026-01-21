# Getting Started with GetNexo 🚀

Welcome to the GetNexo development guide. This document provides everything you need to set up the platform locally and prepare for production.

## 📋 Prerequisites

Before starting, ensure you have the following installed:
- **Node.js**: version 18 or higher.
- **PostgreSQL**: version 14 or higher (for the main data).
- **Redis**: version 7 or higher (for caching and sessions).
- **Docker & Docker Compose**: (Recommended for running external services like n8n and Evolution API).

## 🛠️ Local Development Setup

Follow these steps to get the project running on your machine:

### 1. Clone the Repository
```bash
git clone https://github.com/lelebrr/GetNexo.git
cd GetNexo
```

### 2. Install Dependencies
You need to install dependencies in the root and in the specialized directories:
```bash
# Root and Site dependencies
npm install
```

### 3. Configure Environment Variables
Copy the example environment files and update them with your credentials:
```bash
# In getnexo-site
cp .env.example .env

# In chat-api
cp .env.example .env
```
Check `docs/technical_reference/03_CONFIGURATION.md` for detailed variable descriptions.

### 4. Database Setup
Initialize the PostgreSQL database:
```bash
cd getnexo-site
npm run db:migrate
npm run db:seed
```

### 5. Run the Platform
You can run the backend and frontend separately:

**Terminal 1 (Backend - Chat API):**
```bash
cd chat-api
npm run dev
```

**Terminal 2 (Frontend - GetNexo Site):**
```bash
cd getnexo-site
npm run dev
```

The site will be available at `http://localhost:4321`.

## 🚢 Production Deployment

For production, we recommend using Docker Compose to orchestrate all services including the frontend, backend, database, and Redis.

```bash
docker-compose up -d --build
```

This will start:
-   `getnexo-site` on port 4321
-   `chat-api` on port 3000

## 🧪 Running Tests

Maintain code quality by running the automated test suite:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Performance/Load testing
npm run test:load
```

## 🤝 Next Steps
- Explore the **[Architecture Documentation](../architecture/ARCHITECTURE_ENGINES.md)**.
- Review the **[Security Guidelines](../technical_reference/04_SECURITY_IMPL.md)**.
- Check the **[Admin Manual](../MANUAL_DO_ADMIN.md)**.
