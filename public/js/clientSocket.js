let connected = false;
const port = 3001;

const socket = io(`http://localhost:${port}`);

socket.emit('setup', loggedInUser);

socket.on('connected', () => (connected = true));
socket.on('message received', (newMessage) => messageReceived(newMessage));

socket.on('notification received', (newNotification) => {
  $.get('/api/notifications/latest', (notificationData) => {
    updateBadge('notifications');
  });
});

const emitNotification = (userId) => {
  if (userId == loggedInUser._id) return;

  socket.emit('notification received', userId);
};
