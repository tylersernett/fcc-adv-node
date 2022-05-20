$(document).ready(function () {
  // Form submission with new message in field with id 'm'
  $('form').submit(function () {
    var messageToSend = $('#m').val();
    if (messageToSend) { //prevent sending empty strings
      socket.emit('chat message', messageToSend);//send message to server ... server is listening for 'chat message' to update
    }
      $('#m').val('');
    return false; // prevent form submit from refreshing page
  });
});

/*global io*/
let socket = io();
socket.on('user count', function(data) {
  console.log(data);
});

socket.on('user', data => {
  $('#num-users').text(data.currentUsers + ' users online');
  let message =
    data.name +
    (data.connected ? ' has joined the chat.' : ' has left the chat.');
  $('#messages').append($('<li>').html('<b>' + message + '</b>'));
});

//listen for 'chat message' from server...once received, add a new <li> element with username and message itself
socket.on('chat message', data => {
  $('#messages').append($('<li>').html('<b>' + data.name + ': </b>' + data.message));
});
