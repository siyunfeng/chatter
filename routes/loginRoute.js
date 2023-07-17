const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const User = require('../models/UserModel');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res, next) => {
  const payload = {
    pageTitle: 'Login',
  };
  res.status(200).render('login', payload);
});

router.post('/', async (req, res, next) => {
  const payload = req.body;
  console.log('req.body =', req.body);
  try {
    const { loginUsernameOrEmail, loginPassword } = req.body;
    if (loginUsernameOrEmail && loginPassword) {
      const existingUser = await User.findOne({
        $or: [
          { username: loginUsernameOrEmail },
          { email: loginUsernameOrEmail },
        ],
      });
      console.log('existingUser =', existingUser);
      if (existingUser) {
        const isMatched = await bcrypt.compare(
          loginPassword,
          existingUser.password
        );
        if (isMatched) {
          req.session.user = existingUser;
          return res.redirect('/');
        } else {
          payload.errorMessage = 'Incorrect password. Please try again. ';
          res.status(200).render('login', payload);
        }
      } else {
        payload.errorMessage = 'Username or email does not exist. ';
        res.status(200).render('login', payload);
      }
    } else {
      payload.errorMessage = 'Please enter valid username and password. ';
      res.status(200).render('login', payload);
    }
  } catch (error) {
    console.log('login post error: ', error);
    payload.errorMessage = `Something wrong with logging in, please try again.`;
    res.status(200).render('login', payload);
  }
});

module.exports = router;
