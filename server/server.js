const path = require('path');
const express = require('express');
const http  = require('http');
const socketIO = require('socket.io');
var app = express();

var server = http.createServer(app);
var io = socketIO(server);

const port = process.env.PORT || 3000;

var publicPath = path.join(__dirname, '/../public');



app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('createMessage', function(message) {
        console.log('createMessage', message);
        io.emit('newMessage', {
            from:message.from,
            text: message.text
        });
    });

    // socket.emit('newMessage',{
    //     from:'fag',
    //     text:'sup fag',
    //     createdAt:213
    // });

    socket.on('disconnect' , () => {
            console.log('User disconnected');
        });
});




server.listen(port, () => {
    console.log(`Server started at ${port}`);
});