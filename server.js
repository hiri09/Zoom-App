const express=require("express");
const app=express();
const server=require('http').Server(app);
const io=require('socket.io')(server);
const {v4: uuidv4} = require('uuid');
const {ExpressPeerServer} = require("peer");
const peerServer=ExpressPeerServer(server,{
    debug:true
})
app.set('view engine', 'ejs');
app.use(express.static('public'));


app.use('/peerjs',peerServer);
//here any user will come then it redirects to any url byuuod4 function
app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`);
})
//then here :room means that any ur it redirects there value becomes the room 
// ex uud4 generate the my-app as url then that will be store in room and the room value will be my-app
// and the we can access as we are accessing it like normal url with params

app.get('/new-url',(req,res)=>{
    res.send("hey");
})

app.get('/:room',(req,res)=>{
    res.render('room', {roomId : req.params.room});
})
io.on('connection',socket=>{
    socket.on('join-room',(roomId,userid)=>{
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected',userid);

        socket.on('message',message=>{
            io.to(roomId).emit('createmessage',message);
        })
    })
    socket.on('disconnected',(url)=>{
        // listen for 'redirect' event from the server
        socket.emit('redirect',url);
    })
    

})

server.listen(3030,()=>{
    console.log('server is working ');
})