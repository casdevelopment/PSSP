import { open } from '@op-engineering/op-sqlite';

// Open or create the database
export const db = open({
  name: 'attendanceDB.sqlite',
});

/**
Initialize database tables
 */
export const initDB = async () => {
  try {
    console.log("Initializing local SQLite database tables...");

    // Create offline_attendance table
    await db.executeAsync(`
      CREATE TABLE IF NOT EXISTS offline_attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        schoolId INTEGER,
        classId INTEGER,
        sectionId INTEGER,
        shiftId INTEGER,
        attendanceDate TEXT,
        payload TEXT,
        status TEXT DEFAULT 'pending',
        createdAt TEXT
      );
    `);

    // Create api_cache table
    await db.executeAsync(`
      CREATE TABLE IF NOT EXISTS api_cache (
        cacheKey TEXT PRIMARY KEY,
        responseJson TEXT,
        updatedAt TEXT
      );
    `);

    console.log("Local SQLite database tables initialized successfully.");
  } catch (error) {
    console.error("Error initializing database tables:", error);
  }
};

/**
Save API response to cache
 */
export const saveApiCache = async (cacheKey, data) => {
  try {
    const jsonStr = JSON.stringify(data);
    const now = new Date().toISOString();
    await db.executeAsync(
      `INSERT OR REPLACE INTO api_cache (cacheKey, responseJson, updatedAt) VALUES (?, ?, ?)`,
      [cacheKey, jsonStr, now]
    );
  } catch (error) {
    console.error(`Failed to save API cache for key "${cacheKey}":`, error);
  }
};

/**
Retrieve API response from cache
 */
export const getApiCache = async (cacheKey) => {
  try {
    const result = await db.executeAsync(
      `SELECT responseJson FROM api_cache WHERE cacheKey = ?`,
      [cacheKey]
    );
    const rows = result.rows?._array || result.rows || [];
    if (rows.length > 0) {
      return JSON.parse(rows[0].responseJson);
    }
    return null;
  } catch (error) {
    console.error(`Failed to get API cache for key "${cacheKey}":`, error);
    return null;
  }
};

/**
Save marked attendance to local offline queue
 */
export const saveOfflineAttendance = async (type, schoolId, classId, sectionId, shiftId, attendanceDate, payload) => {
  try {
    const payloadStr = JSON.stringify(payload);
    const now = new Date().toISOString();
    await db.executeAsync(
      `INSERT INTO offline_attendance (type, schoolId, classId, sectionId, shiftId, attendanceDate, payload, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
      [type, schoolId, classId, sectionId, shiftId, attendanceDate, payloadStr, now]
    );
    console.log(`Saved offline ${type} attendance locally.`);
  } catch (error) {
    console.error("Failed to save offline attendance:", error);
    throw error;
  }
};

/**
Fetch all pending offline attendance records
 */
export const getPendingAttendance = async () => {
  try {
    const result = await db.executeAsync(
      `SELECT * FROM offline_attendance WHERE status = 'pending'`
    );
    const rows = result.rows?._array || result.rows || [];
    return rows.map(row => ({
      ...row,
      payload: JSON.parse(row.payload)
    }));
  } catch (error) {
    console.error("Failed to fetch pending offline attendance:", error);
    return [];
  }
};

/**
Update the status of an offline record
 */
export const updateOfflineAttendanceStatus = async (id, status) => {
  try {
    await db.executeAsync(
      `UPDATE offline_attendance SET status = ? WHERE id = ?`,
      [status, id]
    );
  } catch (error) {
    console.error(`Failed to update offline attendance status for ID ${id}:`, error);
  }
};

/**
Delete a synced record from offline queue
 */
export const deleteOfflineAttendance = async (id) => {
  try {
    await db.executeAsync(
      `DELETE FROM offline_attendance WHERE id = ?`,
      [id]
    );
    console.log(`Deleted offline attendance record ID ${id} after sync.`);
  } catch (error) {
    console.error(`Failed to delete offline attendance ID ${id}:`, error);
  }
};

/**
Check if there is an unsynced offline attendance submission for the day
 */
export const checkOfflineSubmission = async (type, schoolId, classId, sectionId, shiftId, dateStr) => {
  try {
    const result = await db.executeAsync(
      `SELECT payload FROM offline_attendance WHERE type = ? AND schoolId = ? AND classId = ? AND sectionId = ? AND shiftId = ? AND attendanceDate = ? AND status = 'pending'`,
      [type, schoolId, classId, sectionId, shiftId, dateStr]
    );
    const rows = result.rows?._array || result.rows || [];
    if (rows.length > 0) {
      return JSON.parse(rows[0].payload);
    }
    return null;
  } catch (error) {
    console.error("Failed to check offline submission:", error);
    return null;
  }
};
