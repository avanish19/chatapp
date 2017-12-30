const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const express = require('express');
const{Users} = require('./utils/user');
const {isRealstring} = require('./utils/validation');
const {generateMessage,generateLocationMessage} = require('./utils/message');
const publicPath=path.join(__dirname,'../public');
const  port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
var io = socketIO(server);
var users = new Users();
app.use(express.static(publicPath));

io.on('connection',(socket)=>{
	console.log("New user connected");

  socket.on('join',(params,callback)=>{
    if(!isRealstring(params.Dname) || !isRealstring(params.jrname)){
      return callback('Name and Room name are required');
    }

    socket.join(params.jrname);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.Dname,params.jrname);
    io.to(params.jrname).emit('updateUserList',users.getUserList(params.jrname));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    // console.log(`${params.Dname} has joined`);
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
       	var user = users.getUser(socket.id);
        if(user && isRealstring(message.text)){
          io.to(user.jrname).emit('newMessage', generateMessage(user.Dname,message.text));
        }
       	
         callback();// data sent from server

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
      var user = users.getUser(socket.id);
      if(user){
        io.to(user.jrname).emit('newLocationMessage',generateLocationMessage(user.Dname,coords.latitude,coords.longitude));
      }
      
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