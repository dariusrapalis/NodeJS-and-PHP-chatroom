/**
 * Created by Darius Rapalis on 8/9/2016.
 */
var socket = io.connect( 'http://playerone.lt:10101' );
var audioURL = "/sounds/chat.wav"; // Downloaded from: http://soundbible.com/2067-Blop.html
var audio = new Audio(audioURL);
var skipAudio = false;
var $messageBox = $("#ChatMessage");
var $messageList = $("#ChatMessageBox");
var $sendButton = $("#ChatWrite");
var $data = $("#data");
var $key = $data.attr('data-private-key');
var shiftPressed = false;
var sound = document.getElementById('chatSound');

$messageBox.on('keydown', function(e) {
    if(e.which == 13 && !shiftPressed) {
        send();
        return false;
    }
    if(e.which == 16) {
        shiftPressed = true;
    }
}).on('keyup', function(e) {
    if(e.which == 16) {
        shiftPressed = false;
    }
});

$sendButton.on('click', function(){send();});

function send() {
    if($messageBox.val().trim().length > 1) {
        socket.emit('message', {privateKey: $key, message: $messageBox.val()});
        $messageBox.val('');
        skipAudio = true;
    }
    $messageBox.focus();
}

function mentionInChat(user) {
    $messageBox.val($messageBox.val() + user + ', ');
    $messageBox.focus();
}

socket.on('message', function(data) {
    $messageList.prepend("<div class='message'>"+data.message+"</div>");
    if(skipAudio)
        skipAudio = false;
    else
        sound.play();
}).on('getMessages', function(data) {
    var messages = JSON.parse(data.message);
    $("#ChatPlaceholder").remove();
    for(var i = 0; i < messages.length; i++) {
        $messageList.append("<div class='message''>"+messages[i]+"</div>");
    }
});