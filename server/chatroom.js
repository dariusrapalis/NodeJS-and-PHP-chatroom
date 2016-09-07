var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var request = require('request');
var sanitizeHtml = require('sanitize-html');

var messages = [];

server.listen(10101, function () {
    console.log("Server is now running on port: 10101");
});

var CHAT_API = 'http://nodephp.p1.lt/API.php';

io.on('connection', function(socket) {
    socket.emit('getMessages', { message: JSON.stringify(messages) });
    socket.on('disconnect', function() {
    }).on('message', function(data) {
        if(data.message.trim().length > 0) {
            var myString = sanitizeHtml(data.message, {
                allowedTags: [],
                allowedAttributes: []
            });
            request.post(
                CHAT_API,
                {form: {privateKey: data.privateKey, action: 'send-chat-message', message: myString}},
                function (error, response, body) {
                    message = JSON.parse(body);
                    var name = sanitizeHtml(message.name, {
                        allowedTags: [],
                        allowedAttributes: []
                    });
                    var msg = '<img src="'+message.profilePicture+'" class="chatProfilePicture" alt="profile picture" /> '+
                        '<a oncontextmenu="mentionInChat(\''+name+'\');return false;" href="/game/profile/'+message.userID+'">'+message.name+'</a>: '+
                        '<span class="message">' + message.message.trim() + '</span><span class="smallTime">'+message.time+'</span>';
                    messages.unshift(msg);
                    messages.splice(20);
                    socket.broadcast.emit('message', {id: message.id, message: msg, audio: true});
                    socket.emit('message', {id: message.id, message: msg, audio: false});
                }
            );
        }
    }).on('delete', function(data){
        if(data.id > 0) {
            request.post(
                CHAT_API,
                {form: {privateKey: data.privateKey, action: 'delete-chat-message', message: data.id}},
                function (error, response, body) {
                    message = JSON.parse(body);
                    socket.broadcast.emit('delete', {id: message.id});
                    socket.emit('delete', {id: message.id});
                }
            );
        }
    });
});
