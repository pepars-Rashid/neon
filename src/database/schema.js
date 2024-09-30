import { pgTable, serial, text, boolean } from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
});

export const tasksTable = pgTable('tasks', {
  id: serial('id').primaryKey(),
  text: text('text').notNull(),
  checked: boolean('checked').notNull().default(false),
  time: text('time').notNull(),
});