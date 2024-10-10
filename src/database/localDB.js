import Dexie from "dexie";
const localDB = new Dexie('MyDatabase');

	// Declare tables, IDs and indexes
	localDB.version(2).stores({
    tasks: '++id, text, checked, time, isPending',
    ququeTasks: 'id, text, checked, time, action' 
}).upgrade(tx => {
    // Set default value for the new column in existing rows
    return tx.table('tasks').toCollection().modify(task => {
        task.isPending = false; // or any default value you prefer
    });
});

	export {localDB}