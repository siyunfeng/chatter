const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
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
    const isValidId = mongoose.isValidObjectId(chatId);
    const erroMessage =
      'Chat does not exist or you do not have permission to view it.';

    let payload = {
      pageTitle: 'Chat',
      loggedInUser: req.session.user,
      loggedInUserJS: JSON.stringify(req.session.user),
    };

    if (!isValidId) {
      payload.errorMessage = erroMessage;
      return res.status(200).render('chatPage', payload);
    }

    let chat = await Chat.findOne({
      _id: chatId,
      users: { $elemMatch: { $eq: userId } },
    }).populate('users');

    if (chat === null) {
      const userFound = await User.findById(chatId);

      if (userFound !== null) {
        chat = await getChatByUserId(userFound._id, userId);
      }
    }

    if (chat === null) {
      payload.errorMessage = erroMessage;
    } else {
      payload.chat = chat;
    }

    res.status(200).render('chatPage', payload);
  } catch (error) {
    console.log('messageRoute /:chatId GET request error: ', error);
  }
});

const getChatByUserId = (loggedInUserId, userToChatWithId) => {
  const chat = Chat.findOneAndUpdate(
    {
      isGroupChat: false,
      users: {
        $size: 2,
        $all: [
          { $elemMatch: { $eq: new mongoose.Types.ObjectId(loggedInUserId) } },
          {
            $elemMatch: { $eq: new mongoose.Types.ObjectId(userToChatWithId) },
          },
        ],
      },
    },
    { $setOnInsert: { users: [loggedInUserId, userToChatWithId] } },
    { new: true, upsert: true }
  ).populate('users');

  return chat;
};

module.exports = router;
