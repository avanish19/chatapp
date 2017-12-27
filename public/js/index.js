var socket = io();
		socket.on('connect',function(){
			console.log('connected to server');
			// socket.emit('createEmail',{
			// 	to:'abc@gmail.com',
			// 	text:'Holjdsklfljjljlwqouoruoijhclxa'
			// });

		});

		socket.on('newMessage',(message)=>{
			console.log('New message',message);
			var li = jQuery('<li></li>');
			li.text(`${message.from}:${message.text}`);
			jQuery('#messages').append(li);
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


			socket.emit('createMessage',{
				from:'User',
				text:jQuery('[name=message]').val()
			}, function(){

			});

		});

		socket.on('newLocationMessage',function(message){
			var li= jQuery('<li></li>');
			var a = jQuery('<a target="_blank">My current location</a>');
			li.text(`${message.from}`);
			a.attr('href',message.url);
			li.append(a);
			jQuery('#messages').append(li);
		});

		var myLocation = jQuery('#send-location');

		myLocation.on('click', function(){
			if(!navigator.geolocation){
				console.log('your browser is not supported');
			}

			navigator.geolocation.getCurrentPosition(function(position){
				socket.emit('createLocationMessage',{
					latitude:position.coords.latitude,
					longitude:position.coords.longitude
				});
			},function(){
				alert('Unable to fetch your location');
			}
			);
		});