const path = require('path');
const publicPath=path.join(__dirname,'../public');
const socketIO = require('socket.io');
const http = require('http');
const  port = process.env.PORT || 3000;


const express = require('express');

const app = express();
const server = http.createServer(app);
const{Users} = require('./utils/user');
var io = socketIO(server);
var users = new Users();
const {generateMessage,generateLocationMessage} = require('./utils/message');
const {isRealstring} = require('./utils/validation');
io.on('connection',(socket)=>{
	//console.log("New user connected");

  socket.on('join',(params,callback)=>{
    if(!isRealstring(params.Dname) || !isRealstring(params.jrname)){
      return callback('Name and Room name are required');
    }

    socket.join(params.jrname);
    console.log(`${params.Dname} has joined`);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.Dname,params.jrname);
    io.to(params.jrname).emit('updateUserList',users.getUserList(params.jrname));

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.jrname).emit('newMessage', generateMessage('Admin',`${params.Dname} has joined`));
    callback();

  });
	
    // socket.emit('newEmail',{
    // 	from:'Admin',
    // 	text:'Welcome',
    // 	createdAt:new Date().getTime()
    // }); 
    // socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app')); //shifted above
    // socket.broadcast.emit('newMessage',{
    // 	from:'Admin',
    // 	text:'New user joined',
    // 	createdAt:new Date().getTime()
    // });
    // socket.broadcast.emit('newMessage',generateMessage('Admin', 'New user joined')); //shifted above
    // // socket.emit('newMessage',{
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
    var user = users.removeUser(socket.id);
    if (user) {
      io.to(user.jrname).emit('updateUserList',users.getUserList(user.jrname));
    io.to(user.jrname).emit('newMessage',generateMessage(`${user.Dname} has left`));}
    
	// console.log("User disconnected");
   });
   });
  

app.use(express.static(publicPath));
server.listen(port,()=>{
	console.log(`Port started on ${port}`);
})