const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/UserModel');

router.get('/', async (req, res, next) => {
  let payload = {
    pageTitle: 'Inbox',
    loggedInUser: req.session.user,
    loggedInUserJS: JSON.stringify(req.session.user),
  };
  res.status(200).render('inboxPage', payload);
});

router.get('/new', async (req, res, next) => {
  let payload = {
    pageTitle: 'New Message',
    loggedInUser: req.session.user,
    loggedInUserJS: JSON.stringify(req.session.user),
  };
  res.status(200).render('newMessage', payload);
});

module.exports = router;
