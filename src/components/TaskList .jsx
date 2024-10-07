"use client"
import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/localDB'; // Ensure this path is correct

export default function TaskList() {
    const tasks = useLiveQuery(() => db.tasks.toArray(), []);
    
    if (!tasks) return <div>Loading...</div>;

    return (
        <ul>
            {tasks.map(task => (
                <li key={task.id}>
                    {task.text} - {task.checked ? 'Done' : 'Pending'} - {task.time}
                </li>
            ))}
        </ul>
    );
}
