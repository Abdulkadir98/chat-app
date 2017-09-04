const path = require('path');
const express = require('express');
const http  = require('http');
const socketIO = require('socket.io');
var app = express();
const _ = require('lodash');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var {ObjectID} = require('mongodb');





var server = http.createServer(app);
var io = socketIO(server);

var {mongoose} = require('./db/mongoose');
var {User} = require('./models/user');
const {Users} = require('./utils/users');
const port = process.env.PORT || 3000;
const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');

var publicPath = path.join(__dirname, '/../public');


var users = new Users();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator()); // Add this after the bodyParser middlewares!

app.use(express.static(publicPath));

app.post('/users',(req,res) => {

    req.checkBody('email', 'valid email is required').isEmail();
    req.checkBody('password', 'must be six characters long').isLength({min:5});

    var errors = req.validationErrors();

    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    if(errors){
        res.send({errors});
    }
    else{
        user.save().then((user) => {
        //res.send(user);
        res.status(200);
        res.redirect('/join-chat.html');
    }, (e) => {
        res.status(400).send(e);
    });
    }
});

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

        var user = users.getUser(socket.id);
        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }

        callback();

        // socket.broadcast.emit('newMessage', {
        //     from:'AKO',
        //     text:'How you doin?',
        //     createdAt: new Date().getTime()
        // });
    });
    socket.on('createLocationMessage', (coords) => {
        var user = users.getUser(socket.id);
        if(user){
        io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }

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