const path = require('path');
const express = require('express');
const http  = require('http');
const socketIO = require('socket.io');
var app = express();

var server = http.createServer(app);
var io = socketIO(server);

const port = process.env.PORT || 3000;
const {generateMessage} = require('./utils/message');

var publicPath = path.join(__dirname, '/../public');



app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

    socket.on('createMessage', function(message) {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));

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