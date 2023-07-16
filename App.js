const express = require('express');
const app = express();
const port = 3001;
const middleware = require('./middleware');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('./db');
const session = require('express-session');

require('dotenv').config();

const server = app.listen(port, () =>
  console.log(`Server listening on port ${port}.`)
);

const sessionSecret = process.env.SESSION_SECRET;

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({ secret: sessionSecret, resave: true, saveUninitialized: false })
);

// Routes
const loginRoute = require('./routes/loginRoute');
const signupRoute = require('./routes/signupRoute');

app.use('/login', loginRoute);
app.use('/signup', signupRoute);

app.get('/', middleware.requireLogin, (req, res, next) => {
  const payload = {
    pageTitle: 'Home',
    loggedInUser: req.session.user,
  };
  res.status(200).render('home', payload);
});
