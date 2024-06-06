// app.js

mm = {  transportOptions: {    polling: {      extraHeaders: {        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxNzIzMjg3MiwianRpIjoiY2ZlZGJhNjEtOWQ2Yy00ZmJhLTgwNDEtMWI3ZjlmMTE2NmEzIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNzE3MjMyODcyLCJjc3JmIjoiNmZkZTgwNWEtZGJkNS00NDY2LTg5YjItYWRlMTNmODE5NmY4IiwiZXhwIjoxNzE3MjMzNzcyfQ.y3hqVnbGjY0ViGooF4A6Cv0n-OrYnKFwMAgVoUOhlEo'      }    }  }}
const socket = io('http://0.0.0.0:8000',
               /*query:{
                    token : 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxNzA5NTgyMywianRpIjoiNzM0N2I0N2QtNWJjNi00NGEzLWJhOTQtNjdlNTNkNzYyMjRiIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNzE3MDk1ODIzLCJjc3JmIjoiNmViZmM1ZWMtYWFhNi00YmQ2LWEzMjQtNzgwNjhkMDdiYWVhIiwiZXhwIjoxNzE3MDk2NzIzfQ.v6irDYKgvtvpYf-WrNZh3oL_QSOkufSA4h10XKWAVhc'
                }*/ mm); // Adjust the URL as needed


const joinRoom = document.querySelector('#join_room')
const leaveRoom = document.querySelector('#leave_room')
const textId_e = document.querySelector('#text_id')
const textarea = document.querySelector('#shared_text');

socket.on('connect', () => {
    console.log('Connected to the server');
    socket.emit('load_text_from_file', { file_id: 3});

});

textarea.addEventListener('input', () => {
    const textId= textId_e.value;
    const content = textarea.value;

    socket.emit('text_update', { text_id: textId, content, file_type: ".txt","owner_id": 1 });
});

socket.on('text_updated', (data) => {
    console.log(data, "hereeeeee")
    textarea.value =  data.content;
});

async function  readFile(file) {
    return await new Response(file).arrayBuffer();
  }

/*
document.querySelector('#join_room').addEventListener('click', () => {
    const textId = document.querySelector('#text_id').value;
    socket.emit('join', { text_id: textId });
});

document.querySelector('#leave_room').addEventListener('click', () => {
    const textId = document.querySelector('#text_id').value;
    socket.emit('leave', { text_id: textId });
});

const textarea = document.querySelector('#shared_text');

textarea.addEventListener('input', () => {
    const textId = document.querySelector('#text_id').value;
    const content = textarea.value;
    socket.emit('text_update', { text_id: textId, content: content });
});

socket.on('connect', () => {
    console.log('Connected to the server');
});

socket.on('status', (data) => {
    console.log(data.msg);
});

socket.on('text_updated', (data) => {
    textarea.value = data.content;
});*/