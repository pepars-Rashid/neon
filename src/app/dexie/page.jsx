"use client"
import React from 'react';
import { db } from '@/database/localDB'; // Ensure this path is correct
import AddTaskForm from '@/components/AddTaskForm';
import TaskList from '@/components/TaskList ';

export default function page() {
    const addTask = async (task) => {
        await db.tasks.add(task);
    };

    return (
        <div>
            <h1>Task Manager</h1>
            <AddTaskForm onAddTask={addTask} />
            <TaskList />
        </div>
    );
}
