const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');
const User = require('../models/UserModel');

router.get('/images/:path', async (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, `../uploads/images/${req.params.path}`));
  } catch (error) {
    console.log('upload images route GET request error: ', error);
  }
});

module.exports = router;
