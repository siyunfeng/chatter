const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../models/UserModel');
const Post = require('../../models/PostModel');

app.use(bodyParser.urlencoded({ extended: false }));

router.post('/', async (req, res, next) => {
  try {
  } catch (error) {
    console.log('chats route POST request error: ', error);
  }
});

module.exports = router;
