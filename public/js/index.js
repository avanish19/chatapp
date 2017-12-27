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