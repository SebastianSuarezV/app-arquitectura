const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB
});

connection.connect((error) => {
    if (error) {
        console.error('Error connecting to the database: ' + error.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
});

app.get('/port', (_, res) => {
    res.send(process.env.POR);
});

app.get('/test-connection', (_, res) => {
    connection.query(`SELECT 1 FROM temperatures`, (error, results, _) => {
        if (error) {
            res.send(error);
        } else {
            res.send(results);
        }
    });
});

app.get('/', (_, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/', (req, res) => {
    connection.query(`INSERT INTO ${req.body.dimension} (value) VALUES (${req.body.value})`, (error, results, _) => {
        if (error) {
            res.send(error);
        } else {
            res.send(results);            
        }
    });
    io.emit(req.body.dimension, req.body.value);
});

app.get('/insert', (req, res) => {
    connection.query(`INSERT INTO ${req.query.dimension} (value) VALUES (${req.query.value})`, (error, results, _) => {
        if (error) {
            res.send(error);
        } else {
            res.send(results);            
        }
    });
    io.emit("temperature", req.query.temperature);
    io.emit("noise", req.query.noise);
    io.emit("humidity", req.query.humidity);
});

server.listen(process.env.PORT);