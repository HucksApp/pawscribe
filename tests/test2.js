// app.js

mm = {  transportOptions: {    polling: {      extraHeaders: {        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTcxNzEwMDE3NSwianRpIjoiY2IxNGFmNDgtYjk3Mi00NmRjLWE4ZTctMGMxZWUyMzYxN2FkIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNzE3MTAwMTc1LCJjc3JmIjoiNDMyNzcyODAtM2ZhNS00YTE0LTgyNTMtNjQ2ODI2ZjgyZDRlIiwiZXhwIjoxNzE3MTAxMDc1fQ.UdIgeAmSQeQ-PPLYQKKd4U7NaZ8n_ydDZQxahlaZkkM'      }    }  }}
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
});

textarea.addEventListener('input', () => {
    const textId= textId_e.value;
    const content = textarea.value;

    socket.emit('text_update', { text_id: textId, content, file_type: ".txt" });
});

socket.on('text_updated', (data) => {
    console.log(data, "hereeeeee")
    textarea.value = data.content;
});


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