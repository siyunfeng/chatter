const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/:id', async (req, res, next) => {
  try {
    const payload = {
      pageTitle: 'View post',
      loggedInUser: req.session.user,
      loggedInUserJS: JSON.stringify(req.session.user),
      postId: req.params.id,
    };
    res.status(200).render('postPage', payload);
  } catch (error) {
    console.log('post details GET request error: ', error);
  }
});

module.exports = router;
