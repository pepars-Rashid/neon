'use server';

import { createUser } from "@/database/queries/insert";

export const handleCreateUser = async () => {
    const fakeUser = {
        name: 'John Doe',
    };
    
    await createUser(fakeUser);
};

