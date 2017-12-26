var socket = io();
		socket.on('connect',function(){
			console.log('connected to server');
			// socket.emit('createEmail',{
			// 	to:'abc@gmail.com',
			// 	text:'Holjdsklfljjljlwqouoruoijhclxa'
			// });

			socket.emit('createMessage',{
				to:'xyz@xyz.com',
				text:'axsdlxlkeojlspwpep'
			});
		});

		socket.on('newMessage',(message)=>{
			console.log('New message',message);
		});

		socket.on('disconnect',function(){
			console.log('disconnected to server');
		});

		socket.on('newEmail',function(email){
			console.log('New email',email);
		});