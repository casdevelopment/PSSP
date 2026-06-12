import { open } from '@op-engineering/op-sqlite';

// Open or create the database
export const db = open({
  name: 'attendanceDB.sqlite',
});

// Initialize database tables
export const initDB = async () => {
  try {
    // Student Attendance Table
    await db.executeAsync(`
      CREATE TABLE IF NOT EXISTS student_attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT NOT NULL,
        student_name TEXT,
        roll_no TEXT,
        class_name TEXT NOT NULL,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        synced INTEGER DEFAULT 0,
        UNIQUE(student_id, date)
      )
    `);

    // Staff Attendance Table
    await db.executeAsync(`
      CREATE TABLE IF NOT EXISTS staff_attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        staff_id TEXT NOT NULL,
        staff_name TEXT,
        date TEXT NOT NULL,
        status TEXT NOT NULL,
        synced INTEGER DEFAULT 0,
        UNIQUE(staff_id, date)
      )
    `);

    console.log('Database tables initialized');
  } catch (error) {
    console.error('Error initializing DB:', error);
  }
};

// Save student attendance records
export const saveStudentAttendance = async (records) => {
  try {
    await db.executeAsync('BEGIN TRANSACTION');
    const query = `
      INSERT INTO student_attendance (student_id, student_name, roll_no, class_name, date, status, synced)
      VALUES (?, ?, ?, ?, ?, ?, 0)
      ON CONFLICT(student_id, date) DO UPDATE SET 
        status=excluded.status, 
        synced=0,
        student_name=excluded.student_name,
        roll_no=excluded.roll_no,
        class_name=excluded.class_name
    `;
    for (const record of records) {
      if (record.status !== null) {
        await db.executeAsync(query, [
          record.target_id,
          record.target_name,
          record.target_subtitle, // roll_no
          record.class_name,
          record.date,
          record.status,
        ]);
      }
    }
    await db.executeAsync('COMMIT');
    console.log('Student attendance saved locally');
    return true;
  } catch (error) {
    await db.executeAsync('ROLLBACK');
    console.error('Error saving student attendance:', error);
    return false;
  }
};

// Save staff attendance records
export const saveStaffAttendance = async (records) => {
  try {
    await db.executeAsync('BEGIN TRANSACTION');
    const query = `
      INSERT INTO staff_attendance (staff_id, staff_name, date, status, synced)
      VALUES (?, ?, ?, ?, 0)
      ON CONFLICT(staff_id, date) DO UPDATE SET 
        status=excluded.status, 
        synced=0,
        staff_name=excluded.staff_name
    `;
    for (const record of records) {
      if (record.status !== null) {
        await db.executeAsync(query, [
          record.target_id,
          record.target_name,
          record.date,
          record.status,
        ]);
      }
    }
    await db.executeAsync('COMMIT');
    console.log('Staff attendance saved locally');
    return true;
  } catch (error) {
    await db.executeAsync('ROLLBACK');
    console.error('Error saving staff attendance:', error);
    return false;
  }
};

// Get today's student attendance
export const getTodaysStudentAttendance = async (date, className) => {
  try {
    const res = await db.executeAsync(
      'SELECT * FROM student_attendance WHERE date = ? AND class_name = ?',
      [date, className]
    );
    // Map back to generic field names for the UI component
    return (res.rows || []).map(row => ({
      ...row,
      target_id: row.student_id,
    }));
  } catch (error) {
    console.error('Error getting todays student attendance:', error);
    return [];
  }
};

// Get today's staff attendance
export const getTodaysStaffAttendance = async (date) => {
  try {
    const res = await db.executeAsync(
      'SELECT * FROM staff_attendance WHERE date = ?',
      [date]
    );
    // Map back to generic field names for the UI component
    return (res.rows || []).map(row => ({
      ...row,
      target_id: row.staff_id,
    }));
  } catch (error) {
    console.error('Error getting todays staff attendance:', error);
    return [];
  }
};

// Get student attendance history summary
export const getStudentAttendanceHistory = async () => {
  try {
    const res = await db.executeAsync(`
      SELECT 
        date, 
        class_name,
        count(*) as total, 
        sum(case when status='Present' then 1 else 0 end) as present, 
        sum(case when status='Absent' then 1 else 0 end) as absent, 
        sum(case when status='Late' then 1 else 0 end) as late 
      FROM student_attendance 
      GROUP BY date, class_name
      ORDER BY date DESC 
      LIMIT 15
    `);
    return res.rows || [];
  } catch (error) {
    console.error('Error getting student history:', error);
    return [];
  }
};

// Get staff attendance history summary
export const getStaffAttendanceHistory = async () => {
  try {
    const res = await db.executeAsync(`
      SELECT 
        date, 
        count(*) as total, 
        sum(case when status='Present' then 1 else 0 end) as present, 
        sum(case when status='Absent' then 1 else 0 end) as absent, 
        sum(case when status='Late' then 1 else 0 end) as late 
      FROM staff_attendance 
      GROUP BY date 
      ORDER BY date DESC 
      LIMIT 7
    `);
    return res.rows || [];
  } catch (error) {
    console.error('Error getting staff history:', error);
    return [];
  }
};