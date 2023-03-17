const socket=io('/');

const videogrid=document.getElementById("video-gird");
console.log(videogrid);
const myvideo=document.createElement('video');
myvideo.muted=true;
let myvideostream;
/*,{
    path:'peerjs',
    host:'/',
    port:'3001'
} */

var peer =new Peer(undefined)
navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
})
.then(stream=>{
    myvideostream=stream;
    addvideostream(myvideo,stream);
    
    peer.on('call',call =>{
        call.answer(stream);
        const video= document.createElement('video');
        call.on('stream',uservideostream=>{
            addvideostream(video,uservideostream);
        })
    })
    
    //user-connected
    socket.on('user-connected',(userid)=>{
       connecttonewuser(userid,stream);
    })
})
.catch((err)=>{
    console.log("error aaa rha hai bro video nhi de rhe wo");
})
// open is used for the emit like open will generate the id and triggerd the callback function
peer.on('open',id=>{
    socket.emit('join-room',ROOM_ID,id);
})


// userid is the user added except me
const connecttonewuser=(userid,stream)=>{
    const call=peer.call(userid,stream);
    const video=document.createElement('video');
    call.on('stream',uservideostream =>{
        addvideostream(video,uservideostream)
    })
}
const addvideostream=(video,stream)=>{
    video.srcObject=stream;
    video.addEventListener('loadedmetadata',()=>{
        video.play();
    })
    videogrid.append(video);
}

var text=document.getElementById("chat_message");
/*const fun=()=>{
    console.log(text.value);
    socket.emit('message',text.value);
    text.value="";
} */
text.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter" ) {

      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      document.getElementById("myBtn").click();
      socket.emit('message',text.value);
      text.value="";
    }
});
  

socket.on('createmessage',message=>{
    const list=document.createElement('li');
    list.innerHTML=`user : ${message}`;
    document.getElementById('messages').append(list);
    scrollBar();
})

function scrollBar() {
    var content = document.getElementById('chat_window');
    content.scrollTop = content.scrollHeight;
 }

const muteUnmute=()=>{
    const enabled=myvideostream.getAudioTracks()[0].enabled;

    if(enabled){
        myvideostream.getAudioTracks()[0].enabled=false;
        setUnmuteButton();
    }
    else{
        setMuteButton();
        myvideostream.getAudioTracks()[0].enabled=true;
    }

}
const setMuteButton = () => {
    const html = `
      <i class="fas fa-microphone"></i>
      <span>Mute</span>
    `
    document.getElementById('main__mute_button').innerHTML = html;
  }
const setUnmuteButton = () => {
    const html = `
      <i class="unmute fas fa-microphone-slash"></i>
      <span>Unmute</span>
    `
    document.getElementById('main__mute_button').innerHTML = html;
}

const playstop=()=>{
    const enabled=myvideostream.getVideoTracks()[0].enabled;
    if(enabled){
        myvideostream.getVideoTracks()[0].enabled=false;
        setPlayVideo();
    }
    else{
        setStopVideo();
        myvideostream.getVideoTracks()[0].enabled=true;
    }
}
const setStopVideo = () => {
    const html = `
      <i class="fas fa-video"></i>
      <span>Stop Video</span>
    `
    document.getElementById('main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
    const html = `
    <i class="stop1 fas fa-video-slash"></i>
    <span>Play Video</span>
    `
    document.getElementById('main__video_button').innerHTML = html;
}

const leave=()=>{
    // emit 'redirect' event to the client
    socket.emit('disconnected','/new-url');
socket.on('redirect', (url)=>{
    window.location.href = url
    
});

}

  
