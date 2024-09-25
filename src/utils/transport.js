import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = process.env.REACT_APP_BASE_API_URL;
const token = localStorage.getItem('jwt_token');

// Create a socket instance with token in headers
const options = {
  transportOptions: {
    polling: { extraHeaders: { Authorization: `Bearer ${token}` } },
  },
};
const socket = io(SOCKET_SERVER_URL, options);

export default socket;
