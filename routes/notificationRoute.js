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
      pageTitle: 'Notifications',
      loggedInUser: req.session.user,
      loggedInUserJS: JSON.stringify(req.session.user),
    };
    res.status(200).render('notificationPage', payload);
  } catch (error) {
    console.log('notificationRoute / GET request error: ', error);
  }
});

module.exports = router;
