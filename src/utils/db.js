import { open } from '@op-engineering/op-sqlite';

// Open or create the database
export const db = open({
  name: 'attendanceDB.sqlite',
});
