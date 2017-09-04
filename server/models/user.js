const mongoose = require('mongoose');
const validator = require('validator');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minLength: 1,
        trim: true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minLength:6
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};