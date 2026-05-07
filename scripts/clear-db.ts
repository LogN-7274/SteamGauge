import 'dotenv/config';
import { AppDataSource } from '../src/dataSource.js';

await AppDataSource.synchronize();
console.log('Database cleared.');
await AppDataSource.destroy();
