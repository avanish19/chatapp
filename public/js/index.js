var socket = io();

function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child')
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}
		socket.on('connect',function(){
			console.log('connected to server');
			// socket.emit('createEmail',{
			// 	to:'abc@gmail.com',
			// 	text:'Holjdsklfljjljlwqouoruoijhclxa'
			// });

		});

		socket.on('newMessage',(message)=>{
			var formattedTime = moment(message.createdAt).calendar();
			var template = jQuery('#message-template').html();
			var html = Mustache.render(template,{
				text:message.text,
				from:message.from,
				createdAt: formattedTime
			});

			// console.log('New message',message);
			// var formattedTime = moment(message.createdAt).calendar();
			// var li = jQuery('<li></li>');
			// li.text(`${message.from} ${formattedTime}:${message.text}`);
			jQuery('#messages').append(html);
			scrollToBottom();
		});

		socket.on('disconnect',function(){
			console.log('disconnected to server');
		});

		socket.on('newEmail',function(email){
			console.log('New email',email);
		});

		// socket.emit('createMessage',{
		// 	from:'Avanish',
		// 	text:'Hello everyone'
		// }, function(data){
		// 	console.log('Got it',data);//acknowledgement
		// });


		jQuery('#message-form').on('submit',function(e){
			e.preventDefault();

			var clearTextbox = jQuery('[name=message]');


			socket.emit('createMessage',{
				from:'User:',
				text:jQuery('[name=message]').val()
			}, function(){
				clearTextbox.val('');

			});

		});

		socket.on('newLocationMessage',function(message){
			var formattedTime = moment(message.createdAt).calendar();
			var template = jQuery('#location-template').html();
			var html = Mustache.render(template,{
				from:message.from,
				url:message.url,
				createdAt:formattedTime
			});
			// var li= jQuery('<li></li>');
			// var a = jQuery('<a target="_blank">My current location</a>');
			// li.text(`${message.from} ${formattedTime}`);
			// a.attr('href',message.url);
			// li.append(a);
			jQuery('#messages').append(html);
			scrollToBottom();
		});

		var myLocation = jQuery('#send-location');

		myLocation.on('click', function(){
			if(!navigator.geolocation){
				console.log('your browser is not supported');
			}

			myLocation.attr('disabled','disabled').text('Sending Location.....');

			navigator.geolocation.getCurrentPosition(function(position){
				myLocation.removeAttr('disabled').text('Send location');
				socket.emit('createLocationMessage',{
					latitude:position.coords.latitude,
					longitude:position.coords.longitude
				});
			},function(){
				myLocation.removeAttr('disabled').text('Send location');
				alert('Unable to fetch your location');
				
			}
			);
		});