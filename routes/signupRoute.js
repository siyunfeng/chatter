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
    pageTitle: 'Sign Up',
  };
  res.status(200).render('signup', payload);
});

router.post('/', async (req, res, next) => {
  const firstName = req.body.firstName.trim();
  const lastName = req.body.lastName.trim();
  const username = req.body.username.trim();
  const email = req.body.email.trim();
  const password = req.body.password;

  const payload = req.body;
  payload.errorMessage = `Please enter a valid value in each field.`;

  if (firstName && lastName && username && email && password) {
    try {
      const user = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });
      if (!user) {
        const data = req.body;
        const saltRounds = 9;
        data.password = await bcrypt.hash(password, saltRounds);
        const newUser = await User.create(data);

        req.session.user = newUser;
        return res.redirect('/');
      } else {
        payload.errorMessage =
          email === user.email
            ? 'Email already exists. '
            : 'Username already exists. ';

        res.status(200).render('signup', payload);
      }
    } catch (error) {
      console.log('signup post error: ', error);
      payload.errorMessage = `Something wrong with creating an account, please try again.`;
      res.status(200).render('signup', payload);
    }
  } else {
    res.status(200).render('signup', payload);
  }
});

module.exports = router;
