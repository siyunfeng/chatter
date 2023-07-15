const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', (req, res, next) => {
  const payload = {
    pageTitle: 'Sign Up',
  };
  res.status(200).render('signup', payload);
});

router.post('/', (req, res, next) => {
  const firstName = req.body.firstName.trim();
  const lastName = req.body.lastName.trim();
  const username = req.body.username.trim();
  const email = req.body.email.trim();
  const password = req.body.password;

  let payload = req.body;
  payload.errorMessage = `Please enter a valid value in each field.`;

  if (firstName && lastName && username && email && password) {
    res.status(200).render('signup');
  } else {
    res.status(200).render('signup', payload);
  }
});

module.exports = router;
