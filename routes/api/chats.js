const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../models/UserModel');
const Post = require('../../models/PostModel');
const Chat = require('../../models/ChatModel');

app.use(bodyParser.urlencoded({ extended: false }));

router.post('/', async (req, res, next) => {
  try {
    if (!req.body.users) {
      console.log('req.body.users not sent with request');
      return res.sendStatus(400);
    }

    let users = JSON.parse(req.body.users);

    if (users.length === 0) {
      console.log('users array is empty');
      return res.sendStatus(400);
    }

    users.push(req.session.user);

    let chatData = { users, isGroupChat: true };
    let newChat = await Chat.create(chatData);
    res.status(200).send(newChat);
  } catch (error) {
    console.log('chats route POST request error: ', error);
    res.sendStatus(400);
  }
});

module.exports = router;
