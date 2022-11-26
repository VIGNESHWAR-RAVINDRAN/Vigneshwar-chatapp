const socket = io('http://localhost:8000');

// Get DOM elements in respective Js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp')
const messageContainer = document.querySelector(".container") //jabh bhi messgaes aayega toh inn container ke andhar daalna hai

// Audio that will play on receiving messages
var audio = new Audio('ting.mp3');

// Function which will append event info to the contaner
const append = (message, position)=>{
     const messageElement = document.createElement('div'); //ek div naam ka element create karna chah raha hoon
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement); //messagecontainer ke andhar append kardo message element
    if(position =='left'){ 
        audio.play(); //append agar chl raha hai toh audio ko play kardoonga
    }
}


// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);

// If a new user joins, receive his/her name from the server
socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'right')  //name ko right mai append karyoonga
})

// If server sends a message, receive it
socket.on('receive', data =>{   //message jo hai receive karo data ke naam pe
    append(`${data.name}: ${data.message}`, 'left')  //data ka naam aur message chahiye
})

// If a user leaves the chat, append the info to the container
socket.on('left', name =>{
    append(`${name} left the chat`, 'right')
})

// If the form gets submitted, send server the message
form.addEventListener('submit', (e) => {
    e.preventDefault(); // isse page aapka reload nahi hoga
    const message = messageInput.value;
    append(`You: ${message}`, 'right');  //${message}->template literals isse aap string ke beech mai daalsakte ho apne variable
    socket.emit('send', message); //server ko batadoonga ki mai message send karraha hoon
    messageInput.value = '' //message khaali ho jaaye yeh karrahe hai
})