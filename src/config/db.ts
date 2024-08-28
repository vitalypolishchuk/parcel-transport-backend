import { Pool } from 'pg';
import { config } from 'dotenv';

config();

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,  // Default PostgreSQL port
    ssl: {
        rejectUnauthorized: false // Render uses self-signed certificates
    }
});

export default pool;