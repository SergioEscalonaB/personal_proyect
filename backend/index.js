require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const db = require('./db');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/cobro', (req, res) => {
    db.all('SELECT * FROM COBRO', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

app.listen(port, () => {
  console.log(`Servidor listo en http://localhost:${port}`);
});
