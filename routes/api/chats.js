const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../models/UserModel');
const Post = require('../../models/PostModel');
const Chat = require('../../models/ChatModel');

app.use(bodyParser.urlencoded({ extended: false }));

// create a new chat page
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

// get chat by searching specific users, return the most recent chat(in descending order)
router.get('/', async (req, res, next) => {
  try {
    let newChat = await Chat.find({
      users: { $elemMatch: { $eq: req.session.user._id } },
    })
      .populate('users')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    newChat = await User.populate(newChat, { path: 'latestMessage.sender' });

    res.status(200).send(newChat);
  } catch (error) {
    console.log('chats route GET request error: ', error);
    res.sendStatus(400);
  }
});

// get specific chat info, includs chat name
router.get('/:chatId', async (req, res, next) => {
  try {
    const { chatId } = req.params;

    let chat = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: req.session.user._id } },
    }).populate('users');

    res.status(200).send(chat);
  } catch (error) {
    console.log('chats route specific chat GET request error: ', error);
    res.sendStatus(400);
  }
});

// update chat name
router.put('/:chatId', async (req, res, next) => {
  try {
    const { chatId } = req.params;
    // req.body is everything we pass by the PUT request, data: {chatName: name}
    await Chat.findByIdAndUpdate(chatId, req.body);
    res.sendStatus(204);
  } catch (error) {
    console.log('chats route update chat name PUT request error: ', error);
    res.sendStatus(400);
  }
});

module.exports = router;
