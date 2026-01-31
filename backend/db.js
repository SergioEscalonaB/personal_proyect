const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.resolve(__dirname, process.env.DB_PATH);

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
	if (err) {
		console.error('Error al abrir CA.db:', err.message);
	} else {
		console.log('Conectado a CA.db');
	}
});

module.exports = db;
