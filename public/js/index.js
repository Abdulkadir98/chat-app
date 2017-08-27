

var socket = io();

function scrollToBottom(){
    //Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li:last-child');
    //Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(scrollTop + clientHeight + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }


}
    socket.on('connect', function () {
        console.log('Connected with server');
        // socket.emit('createEmail', {
        //     to:'khala97@fag.com',
        //     text:'sup'
        // });

        // socket.emit('createMessage', {
        //     to:'someFag',
        //     text: 'sup dawg'
        // });
    });

    socket.on('disconnect' , function () {
        console.log('Disconnected from server');
    });

    // // socket.on('newEmail', function (email){
    // //     console.log('new Email',email);
    // });
socket.on('newMessage', function (message){
    console.log('new message', message);

    var formattedTime = moment(message.createdAt).format('h:mm A');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from:message.from,
        createdAt:formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();

    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    // jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm A');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template,{
        from:message.from,
        text:message.text,
        createdAt:formattedTime,
        url:message.url
    });

    jQuery('#messages').append(html);
    scrollToBottom();
});

jQuery('#message-form').on('submit', function(e) {

    var messageTextBox = jQuery('[name=message]');
    e.preventDefault();
    socket.emit('createMessage', {
        from:'User',
        text: messageTextBox.val()
    }, function() {
        messageTextBox.val('')
    });
});

var locationButton = jQuery('#send-location');


locationButton.on('click', function() {
    if(!navigator.geolocation){
        return alert('Gelocation not supported in your browser');
    }

    locationButton.attr('disabled','disabled');
    navigator.geolocation.getCurrentPosition(function (position) {
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        });

        locationButton.removeAttr('disabled');
    }, function() {
        alert('Unable to fetch location');
        locationButton.removeAttr('disabled');
    });

});