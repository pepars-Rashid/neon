import { db } from './lib/db';

export async function getData() {
    const data = await db.query(/* your SQL query here */);
    return data;
}