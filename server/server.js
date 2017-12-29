const path = require('path');
const publicPath=path.join(__dirname,'../public');
const socketIO = require('socket.io');
const http = require('http');
const  port = process.env.PORT || 3000;


const express = require('express');

const app = express();
const server = http.createServer(app);
var io = socketIO(server);
const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealstring} = require('./utils/validation');
io.on('connection',(socket)=>{
	console.log("New user connected");

  socket.on('join',(params,callback)=>{
    if(!isRealstring(params.Dname) || !isRealstring(params.jrname)){
      callback('Name and Room name are required');
    }
    callback();

  });
	
    // socket.emit('newEmail',{
    // 	from:'Admin',
    // 	text:'Welcome',
    // 	createdAt:new Date().getTime()
    // }); 
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    // socket.broadcast.emit('newMessage',{
    // 	from:'Admin',
    // 	text:'New user joined',
    // 	createdAt:new Date().getTime()
    // });
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));
    // socket.emit('newMessage',{
    // 	from:'ashdkh@khjksahdhi.com',
    // 	text:'dshifyiwerhcbhsjguyb bn',
    // 	createdAt:123143425436
    // });

       socket.on('createMessage',(message,callback)=>{
       	console.log('createMessage',message);
       	io.emit('newMessage', generateMessage(message.from,message.text));
         callback('This is from  the server');// data sent from server

       //  io.emit('newMessage',{
       // 	from:message.from,
       // 	text:message.text,
       // 	createdAt:new Date().getTime()
       // });
       });
       
    // socket.on('createEmail',(newEmail)=>{
    // 	console.log('createEmail',newEmail);
    // });

    // socket.on('createMessage',(message)=>{
    // 	console.log('created message',message);
    // });

    socket.on('createLocationMessage',(coords)=>{
      io.emit('newLocationMessage',generateLocationMessage('Admin',coords.latitude,coords.longitude));
      // io.emit('newMessage',generateMessage('Admin',`${coords.latitude},${coords.longitude}`));
    });
 
	socket.on('disconnect',()=>{
	console.log("User disconnected");
});
});

app.use(express.static(publicPath));
server.listen(port,()=>{
	console.log(`Port started on ${port}`);
})