const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../models/UserModel');
const Post = require('../../models/PostModel');
const Chat = require('../../models/ChatModel');
const Message = require('../../models/MessageModel');
const Notification = require('../../models/NotificationModel');

app.use(bodyParser.urlencoded({ extended: false }));

// create a new message
router.post('/', async (req, res, next) => {
  try {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      console.log('invalid data passed into request');
      return res.sendStatus(400);
    }

    let newMessage = {
      sender: req.session.user._id,
      content: content,
      chat: chatId,
    };

    let message = await Message.create(newMessage);
    message = await message.populate('sender');
    message = await message.populate('chat');
    message = await User.populate(message, { path: 'chat.users' });

    const chat = await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    insertNotifications(chat, message);

    res.status(201).send(message);
  } catch (error) {
    console.log('/api/messages route POST request error: ', error);
    res.sendStatus(400);
  }
});

const insertNotifications = (chat, message) => {
  chat.users.forEach((userId) => {
    if (userId != message.sender._id.toString()) {
      Notification.insertNotification(
        userId,
        message.sender._id,
        'newMessage',
        message.chat._id
      );
    }
  });
};

module.exports = router;
