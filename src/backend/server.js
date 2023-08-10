
/* Well this is my server.js which has all the backend logic for connecting to MYSQL and performing all the CRUD Operations on the database */

/* Each api call is written in a way that will return the data in the specified format */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const mysql = require('mysql');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    exposedHeaders: ["Content-Disposition"]
}));

// Create MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: '', 
    database: 'contactDB' 
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL connected...');
});

// CREATE Contact
app.post('/api/contacts', (req, res) => {
    const { fName, lName, email, phone, imageUrl } = req.body;
    let sql = 'INSERT INTO contacts (fName, lName, email, phone, imageUrl) VALUES (?, ?, ?, ?, ?)';
    let values = [fName, lName, email, phone, imageUrl];
    db.query(sql, values, (err, result) => {
        if (err) throw err;
        res.status(201).json({ id: result.insertId, fName, lName, email, phone, imageUrl });
    });
});

// READ all Contacts
app.get('/api/contacts', (req, res) => {
    let sql = 'SELECT * FROM contacts';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.status(200).json(results);
    });
});

// READ one Contact by ID
app.get('/api/contacts/:id', (req, res) => {
    let sql = 'SELECT * FROM contacts WHERE id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) throw err;
        if (results.length === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.status(200).json(results[0]);
    });
});

// UPDATE Contact
app.put('/api/contacts/:id', (req, res) => {
    const { fName, lName, email, phone, imageUrl } = req.body;
    let sql = 'UPDATE contacts SET fName = ?, lName = ?, email = ?, phone = ?, imageUrl = ? WHERE id = ?';
    db.query(sql, [fName, lName, email, phone, imageUrl, req.params.id], (err, results) => {
        if (err) throw err;
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.status(200).json({ id: req.params.id, fName, lName, email, phone, imageUrl });
    });
});

// DELETE Contact
app.delete('/api/contacts/:id', (req, res) => {
    let sql = 'DELETE FROM contacts WHERE id = ?';
    db.query(sql, [req.params.id], (err, results) => {
        if (err) throw err;
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        }
        res.status(204).send();
    });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
});

const upload = multer({ storage: storage });

app.post('/api/contacts/upload', upload.single('contactImage'), (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        return next(error);
    }
    res.json(file.filename);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
