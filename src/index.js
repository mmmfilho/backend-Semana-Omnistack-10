const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const http = require('http');
const { setUpWebSocket } = require('./websocket');

const app = express();

const server = http.Server(app);

setUpWebSocket(server);

mongoose.connect('mongodb+srv://mauro:123mauro@cluster0-7bkgu.mongodb.net/week10?retryWrites=true&w=majority',{
    useNewUrlParser: true ,
    useUnifiedTopology: true

});
app.use(cors())
app.use(express.json());
app.use(routes);

server.listen(3333);