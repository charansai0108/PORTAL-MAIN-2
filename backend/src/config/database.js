/**
 * Database Configuration
 * Prisma Client singleton for database access
 * Uses SQLite for development/testing
 */

// CRITICAL: Load environment variables FIRST before accessing process.env
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

// Get the directory of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file from the backend root directory (parent of src/config/)
dotenv.config({ path: join(__dirname, '../../.env') });

import { PrismaClient } from '@prisma/client';

// Prisma client configuration for SQLite
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['error', 'warn'] 
    : ['error'],
});

// We connect/validate from server startup (fail-fast). Exporting the client here.

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

// Handle process termination signals
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Helper function to handle connection pool errors
export function handleDatabaseError(error) {
  if (error?.code === 'P2024') {
    // Connection pool timeout
    console.error('Database connection pool exhausted. This may indicate:');
    console.error('1. Too many concurrent requests');
    console.error('2. Long-running queries holding connections');
    console.error('3. Database connection leaks');
    console.error('4. Render database may be sleeping (free tier)');
  } else if (error?.code === 'P1017') {
    // Server closed connection
    console.error('Database server closed the connection. Render database may have gone to sleep.');
  } else if (error?.code === 'P1001') {
    // Can't reach database server
    console.error('Cannot reach database server. Please check:');
    console.error('1. Database is running on Render');
    console.error('2. DATABASE_URL is correct');
    console.error('3. Network connectivity');
  }
  return error;
}

export default prisma;
