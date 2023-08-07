const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/UserModel');
const Chat = require('../models/ChatModel');

router.get('/', async (req, res, next) => {
  try {
    let payload = {
      pageTitle: 'Inbox',
      loggedInUser: req.session.user,
      loggedInUserJS: JSON.stringify(req.session.user),
    };
    res.status(200).render('inboxPage', payload);
  } catch (error) {
    console.log('messageRoute / GET request error: ', error);
  }
});

router.get('/new', async (req, res, next) => {
  try {
    let payload = {
      pageTitle: 'New Message',
      loggedInUser: req.session.user,
      loggedInUserJS: JSON.stringify(req.session.user),
    };
    res.status(200).render('newMessage', payload);
  } catch (error) {
    console.log('messageRoute /new GET request error: ', error);
  }
});

router.get('/:chatId', async (req, res, next) => {
  try {
    const userId = req.session.user._id;
    const { chatId } = req.params;

    let chat = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: userId } },
    }).populate('users');

    let payload = {
      pageTitle: 'Chat',
      loggedInUser: req.session.user,
      loggedInUserJS: JSON.stringify(req.session.user),
      chat: chat,
    };
    res.status(200).render('chatPage', payload);
  } catch (error) {
    console.log('messageRoute /:chatId GET request error: ', error);
  }
});

module.exports = router;
