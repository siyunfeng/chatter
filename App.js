const express = require('express');
const app = express();
const port = 3001;
const { requireLogin } = require('./middleware');
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
const logoutRoute = require('./routes/logoutRoute');
const postRoute = require('./routes/postRoute');
const profileRoute = require('./routes/profileRoute');
const uploadRoute = require('./routes/uploadRoute');
const searchRoute = require('./routes/searchRoute');
const messageRoute = require('./routes/messageRoute');

app.use('/login', loginRoute);
app.use('/signup', signupRoute);
app.use('/logout', logoutRoute);
app.use('/post', requireLogin, postRoute);
app.use('/profile', requireLogin, profileRoute);
app.use('/uploads', requireLogin, uploadRoute);
app.use('/search', requireLogin, searchRoute);
app.use('/messages', requireLogin, messageRoute);

// APIs
const postAPIRoute = require('./routes/api/posts');
const userAPIRoute = require('./routes/api/users');
const chatAPIRoute = require('./routes/api/chats');

app.use('/api/posts', postAPIRoute);
app.use('/api/users', userAPIRoute);
app.use('/api/chats', chatAPIRoute);

app.get('/', requireLogin, (req, res, next) => {
  const payload = {
    pageTitle: 'Home',
    loggedInUser: req.session.user,
    loggedInUserJS: JSON.stringify(req.session.user),
  };
  res.status(200).render('home', payload);
});
