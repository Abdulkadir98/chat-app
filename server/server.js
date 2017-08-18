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

    socket.emit('newMessage',{
        from: 'Admin',
        text:'Welcome to the chat app',
        createdAt: new Date().getTime()
    });

    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text:'new user joined',
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', function(message) {
        console.log('createMessage', message);
        // io.emit('newMessage', {
        //     from:message.from,
        //     text: message.text
        // });

        // socket.broadcast.emit('newMessage', {
        //     from:'AKO',
        //     text:'How you doin?',
        //     createdAt: new Date().getTime()
        // });
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