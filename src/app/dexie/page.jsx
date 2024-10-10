"use client"
import React from 'react';
import { localDB } from '@/database/localDB'; // Ensure this path is correct
import AddTaskForm from '@/components/AddTaskForm';
import TaskList from '@/components/TaskList ';
import { insertTask } from '../action';

export default function page() {
    const addTask = async (task) => {
        const id = await localDB.tasks.add({...task, isPending:true}); // make it pending here
        try{
        await insertTask({id, ...task})
        await localDB.tasks.update(id, { isPending:false })
        } catch(err){
            console.log("err!:", err)
            await localDB.ququeTasks.add({id, ...task, action:"addTask"})
        }

    };
    const deleteTask = async (id) => {
        console.log(id)
        await localDB.tasks.delete(id)
        try{
            // real database
            // change local database from pendding to done
        } catch(err){
            // quque action
        }
    }

    return (
        <div>
            <h1>Task Manager</h1>
            <AddTaskForm onAddTask={addTask} />
            <TaskList onDeleteTask={deleteTask}/>
        </div>
    );
}


const syncQuque = async () =>{
    const quque = await localDB.ququeTasks.toArray()
    for(const task of quque){
        const id = task.id; 
        console.log(task)
        switch(task.action){
            case "addTask":
                console.log('!!!')
                try{
                await insertTask({id, ...task})
                await localDB.tasks.update(id, { isPending:false })
                await localDB.ququeTasks.delete(id)
                }
                catch(err){
                    console.log("err: ", err)
                }
                break;    
        }
    }
}

setInterval(syncQuque, 10 * 1000)
