'use server';

import { db } from "@/database/db"
import { usersTable } from "@/database/schema"

export const handleCreateUser = async () => {
    
    const fakeUser = {
        name: 'John Doe',
    }

    await db.insert(usersTable).values(fakeUser)  
};

