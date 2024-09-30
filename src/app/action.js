'use server';
import { eq } from 'drizzle-orm';
import { db } from "@/database/db"
import { usersTable, tasksTable } from "@/database/schema"

export const handleCreateUser = async () => {
    
    const fakeUser = {
        name: 'John Doe',
    }

    await db.insert(usersTable).values(fakeUser)  
};

export const handleForm = async (preState, data) => {
    console.log("preState: ", preState)
    console.log("data: ", data )
    // const name = data.get("name")
    // const d = {name}

    // await db.insert(usersTable).values(d)
}

export const updateName = async (preState, data) =>{
    // console.log("preState: ", preState)
    // console.log("data: ", data )
    const newName = data.get("name")
    const id = data.get("id")

    await db.update(usersTable)
    .set({ name: newName })
    .where(eq(usersTable.id, id));
    
}

export const myQuries = async () =>{
    // const result = await db.select().from(usersTable);
    // const result = await db.select({
    //     field1: usersTable.id,
    //     field2: usersTable.name,
    //     }).from(usersTable);

    //     const { field1, field2 } = result[1];

    // console.log("result: ",result)
    // console.log("field1: ", field1)
    // console.log("field2: ",field2)

}

export const getAllTasks= async () => {
    const tasks = await db.select().from(tasksTable).execute();
    return tasks;
  }

    export const insertTodo = async (preState, data) => {
        const text = data.get("text")
        const number = data.get("number")
        const unit = data.get("unit")
        const time = `${number} ${unit}`
        
        await db.insert(tasksTable).values({text , time})     
}

    export const deleteRow = async (id) =>{
        await db.delete(tasksTable)
        .where(eq(tasksTable.id, id));
    }

    export const updateCheckbox = async (id) =>{
        const task = await db.select().from(tasksTable).where(eq(tasksTable.id, id)).then(rows => rows[0]);
        const checked = task.checked;

        await db.update(tasksTable)
    .set({ checked: !checked })
    .where(eq(tasksTable.id, id));
    }
