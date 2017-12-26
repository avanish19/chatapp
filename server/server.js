const path = require('path');
const publicPath=path.join(__dirname,'../public');
const socketIO = require('socket.io');
const http = require('http');
const  port = process.env.PORT || 3000;


const express = require('express');

const app = express();
const server = http.createServer(app);
var io = socketIO(server);

io.on('connection',(socket)=>{
	console.log("New user connected");
	
    // socket.emit('newEmail',{
    // 	from:'avanish@gm.com',
    // 	text:'whats going on',
    // 	createdAt:123
    // }); 

    socket.emit('newMessage',{
    	from:'ashdkh@khjksahdhi.com',
    	text:'dshifyiwerhcbhsjguyb bn',
    	createdAt:123143425436
    });

       
    // socket.on('createEmail',(newEmail)=>{
    // 	console.log('createEmail',newEmail);
    // });

    socket.on('createMessage',(message)=>{
    	console.log('created message',message);
    });
	socket.on('disconnect',()=>{
	console.log("User disconnected");
});
});

app.use(express.static(publicPath));
server.listen(port,()=>{
	console.log(`Port started on ${port}`);
})