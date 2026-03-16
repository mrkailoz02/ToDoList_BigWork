import pkg from 'pg';
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

const { DB_USER, DB_PASSWORD, DB_DATABASE, DB_HOST, DB_PORT } = process.env;

// 1. ตั้งค่า Connection Pool
const pool = new Pool({
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST || "localhost",
  database: DB_DATABASE,
  port: Number(DB_PORT) || 5432,
  max: 20,              // จำนวนการเชื่อมต่อสูงสุด
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// 2. Helper สำหรับ Query (รองรับ Generic Type <T>)
const query = async <T extends any>(text: string, params?: any[]): Promise<T[]> => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  
  // Log การทำงาน (ถ้าต้องการ)
  // console.log('executed query', { text, duration, rows: res.rowCount });
  
  return res.rows as T[];
};

// 3. Helper สำหรับ Transaction (สำหรับงานสต็อกที่ต้อง Insert/Update หลายตารางพร้อมกัน)
const getClient = async () => {
  const client = await pool.connect();
  const query = client.query.bind(client);
  const release = client.release.bind(client);
  
  return { client, query, release };
};

// 4. วิธีการทำงานแบบ Transaction สไตล์ใหม่
const transaction = async (callback: (client: any) => Promise<void>) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await callback(client);
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};

export default { 
  query, 
  getClient, 
  transaction,
  rawPool: pool // เผื่อกรณีต้องการใช้ pool ตรงๆ
};