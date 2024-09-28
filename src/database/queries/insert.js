//insert.js
import { db } from '../db';
import { usersTable } from '../schema.js';

export async function createUser(data) {
  await db.insert(usersTable).values(data);
}