"use client"
import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/database/localDB'; // Ensure this path is correct

export default function TaskList({onDeleteTask}) {
    const tasks = useLiveQuery(() => db.tasks.toArray(), []);

    const handleDelete = (id)=>{
        const intId = parseInt(id, 10)
        onDeleteTask(intId)
    }

    if (!tasks) return <div>Loading...</div>

    return (
        <ul className='flex flex-col gap-[5px]'>
            {tasks.map(task => (
                <li key={task.id} className='flex gap-[15px]'>
                    {task.text} - {task.checked ? '✔' : '❌'} - {task.time} 
                    <button
                        name='id'
                        value={task.id}
                        onClick={(e)=>{
                            e.preventDefault()
                            handleDelete(e.target.value)
                        }}
                        className='border-[1px] border-gray-800 bg-red-600 p-[2px]'>
                        Delete 🗑
                    </button>
                </li>
            ))}
        </ul>
    );
}
