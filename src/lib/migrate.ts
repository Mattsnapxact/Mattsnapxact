import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function runMigrations() {
  if (process.env.NODE_ENV === 'production') {
    try {
      console.log('Running database migrations...');
      await execAsync('npx prisma migrate deploy');
      console.log('Migrations completed successfully');
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }
}
