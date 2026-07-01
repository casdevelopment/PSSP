import { markStudentsAttendance, markEmployeeAttendance } from '../network/apis';
import { getPendingAttendance, deleteOfflineAttendance, updateOfflineAttendanceStatus } from './db';

// Track if a sync operation is currently active to avoid concurrent sync runs
let isSyncing = false;

export const syncOfflineAttendance = async () => {
  if (isSyncing) {
    console.log("Offline sync is already in progress, skipping...");
    return;
  }

  try {
    const pending = await getPendingAttendance();
    if (pending.length === 0) {
      return;
    }

    isSyncing = true;
    console.log(`Found ${pending.length} pending offline attendance records. Starting sync...`);

    for (const item of pending) {
      try {
        // Mark as syncing to prevent other processes from accessing it
        await updateOfflineAttendanceStatus(item.id, 'syncing');

        let res;
        if (item.type === 'student') {
          res = await markStudentsAttendance(item.payload);
        } else if (item.type === 'staff') {
          // If staff payload is empty/null (0 presents, all absent), we skip sending API
          if (item.payload) {
            res = await markEmployeeAttendance(item.payload);
          } else {
            res = { success: true };
          }
        }

        if (res && res.success !== false) {
          console.log(`Successfully synced offline attendance ID: ${item.id}`);
          await deleteOfflineAttendance(item.id);
        } else {
          console.warn(`Server rejected offline attendance ID: ${item.id}. Message: ${res?.message}`);
          // Discard rejected offline items (validation error) so they don't block the queue
          await deleteOfflineAttendance(item.id);
        }
      } catch (error) {
        console.error(`Failed to sync offline attendance ID: ${item.id}`, error);
        
        const isNetwork = !error.response || error.message?.includes('Network Error') || error.message?.includes('timeout');
        if (isNetwork) {
          // Revert status to pending so it can be retried later
          await updateOfflineAttendanceStatus(item.id, 'pending');
          console.log("Network/Connectivity error detected. Aborting current sync batch.");
          break;
        } else {
          // Validation/Structural error (e.g. 400 Bad Request): drop it from queue to avoid deadlocks
          console.warn("Structural/API error detected. Discarding invalid offline record from queue.");
          await deleteOfflineAttendance(item.id);
        }
      }
    }
  } catch (error) {
    console.error("Error running offline sync process:", error);
  } finally {
    isSyncing = false;
  }
};
