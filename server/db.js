import 'dotenv/config'
import pg from 'pg'

const isLocal = process.env.DATABASE_URL?.includes('localhost')

export const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false },
})