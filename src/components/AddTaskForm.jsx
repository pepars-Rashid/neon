"use client"
import React, { useState } from 'react';

export default function AddTaskForm({ onAddTask }) {
    const [text, setText] = useState('');
    const [checked, setChecked] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddTask({ text, checked, time: new Date().toISOString() });
        setText('');
        setChecked(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Task text"
                required
            />
            <label>
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => setChecked(e.target.checked)}
                />
                Checked
            </label>
            <button type="submit">Add Task</button>
        </form>
    );
}
