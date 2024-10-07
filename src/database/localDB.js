import Dexie from "dexie";
const db = new Dexie('MyDatabase');

	// Declare tables, IDs and indexes
	db.version(1).stores({
		tasks: '++id, text, checked, time'
	});

	export {db}