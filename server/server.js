const path = require('path');
const express = require('express');
const http  = require('http');
const socketIO = require('socket.io');
var app = express();

var server = http.createServer(app);
var io = socketIO(server);

const {User} = require('./utils/users');
const port = process.env.PORT || 3000;
const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');

var publicPath = path.join(__dirname, '/../public');


var users = new User();
app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join',(params,callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            return callback('Please enter a valid name or room');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);
        io.to(params.room).emit('updateUserList', users.getUsersList(params.room));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app!'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin',
                                                                `${params.name} has joined`));
        callback();
    });



    socket.on('createMessage', function(message, callback) {
        console.log('createMessage', message);
        io.emit('newMessage', generateMessage(message.from, message.text));

        callback();

        // socket.broadcast.emit('newMessage', {
        //     from:'AKO',
        //     text:'How you doin?',
        //     createdAt: new Date().getTime()
        // });
    });
    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect' , () => {
            var user = users.removeUser(socket.id);
            if(user){
                io.to(user.room).emit('updateUserList', users.getUsersList(user.room));
                io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room.`));

            }
        });
});




server.listen(port, () => {
    console.log(`Server started at ${port}`);
});