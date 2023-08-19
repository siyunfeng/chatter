let connected = false;
const port = 3001;

const socket = io(`http://localhost:${port}`);

socket.emit('setup', loggedInUser);

socket.on('connected', () => (connected = true));
