const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../models/UserModel');
const Post = require('../../models/PostModel');

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('postedBy')
      .sort({ createdAt: -1 });
    if (posts) {
      res.status(200).send(posts);
    }
  } catch (error) {
    console.log('posts GET request error >>> ', error);
    res.sendStatus(400);
  }
});

router.post('/', async (req, res, next) => {
  if (!req.body.content) {
    return res.sendStatus(400);
  }
  const postData = {
    content: req.body.content,
    postedBy: req.session.user,
  };
  try {
    let newPost = await Post.create(postData);
    if (newPost) {
      newPost = await User.populate(newPost, { path: 'postedBy' });
      res.status(201).send(newPost);
    }
  } catch (error) {
    console.log('posts POST request error >>> ', error);
    res.sendStatus(400);
  }
});

module.exports = router;
