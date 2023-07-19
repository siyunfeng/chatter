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

router.put('/:id/like', async (req, res, next) => {
  try {
    const postId = req.params.id;
    const loginUser = req.session.user;
    const userId = loginUser._id;
    const isLiked = loginUser.likes && loginUser.likes.includes(postId);

    const option = isLiked ? '$pull' : '$addToSet';
    // find the login user and update their likes, return the updated user info
    // assign the updated user info to req.session.user
    req.session.user = await User.findByIdAndUpdate(
      userId,
      { [option]: { likes: postId } },
      { new: true }
    );

    const post = await Post.findByIdAndUpdate(
      postId,
      { [option]: { likes: userId } },
      { new: true }
    );

    res.status(200).send(post);
  } catch (error) {
    console.log('posts PUT request error >>> ', error);
    res.sendStatus(400);
  }
});

module.exports = router;
