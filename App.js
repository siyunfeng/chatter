const express = require('express');
const app = express();
const port = 3001;
const middleware = require('./middleware');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
const mongoose = require('./db');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
const loginRoute = require('./routes/loginRoute');
const signupRoute = require('./routes/signupRoute');

app.use('/login', loginRoute);
app.use('/signup', signupRoute);

const server = app.listen(port, () =>
  console.log(`Server listening on port ${port}.`)
);

app.get('/', middleware.requireLogin, (req, res, next) => {
  const payload = {
    pageTitle: 'Home',
  };
  res.status(200).render('home', payload);
});
