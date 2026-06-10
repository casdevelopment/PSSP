import { open } from '@op-engineering/op-sqlite';

// Open or create the database
export const db = open({
  name: 'attendanceDB.sqlite',
});

// Initialize database tables
export const initDB = async () => {
  try {
    await db.executeAsync(`
      CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        target_id TEXT NOT NULL,
        target_name TEXT,
        target_subtitle TEXT,
        class_name TEXT,
        type TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        synced INTEGER DEFAULT 0,
        UNIQUE(target_id, date, type)
      )
    `);

    // Attempt to add class_name if missing
    try {
        await db.executeAsync('ALTER TABLE attendance ADD COLUMN class_name TEXT;');
    } catch(e) {}

    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing DB:', error);
  }
};

// Save attendance records
export const saveAttendance = async (records) => {
  try {
    await db.executeAsync('BEGIN TRANSACTION');
    const query = `
      INSERT INTO attendance (target_id, target_name, target_subtitle, class_name, type, date, status, synced)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
      ON CONFLICT(target_id, date, type) DO UPDATE SET 
        status=excluded.status, 
        synced=0,
        target_name=excluded.target_name,
        target_subtitle=excluded.target_subtitle,
        class_name=excluded.class_name
    `;
    for (const record of records) {
      if (record.status !== null) {
        await db.executeAsync(query, [
          record.target_id,
          record.target_name,
          record.target_subtitle,
          record.class_name || null,
          record.type,
          record.date,
          record.status,
        ]);
      }
    }
    await db.executeAsync('COMMIT');
    console.log('Attendance saved locally');
    return true;
  } catch (error) {
    await db.executeAsync('ROLLBACK');
    console.error('Error saving attendance:', error);
    return false;
  }
};

// Get today's attendance for a type
export const getTodaysAttendance = async (date, type, className) => {
  try {
    let query = 'SELECT * FROM attendance WHERE date = ? AND type = ?';
    const params = [date, type];

    if (className) {
      query += ' AND class_name = ?';
      params.push(className);
    }
    const res = await db.executeAsync(query, params);
    return res.rows || [];
  } catch (error) {
    console.error('Error getting todays attendance:', error);
    return [];
  }
};

// Get attendance history summary
export const getAttendanceHistory = async (type) => {
  try {
    const res = await db.executeAsync(`
      SELECT 
        date, 
        count(*) as total, 
        sum(case when status='Present' then 1 else 0 end) as present, 
        sum(case when status='Absent' then 1 else 0 end) as absent, 
        sum(case when status='Late' then 1 else 0 end) as late 
      FROM attendance 
      WHERE type=? 
      GROUP BY date 
      ORDER BY date DESC 
      LIMIT 7
    `, [type]);
    return res.rows || [];
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};
