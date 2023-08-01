const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../models/UserModel');
const Post = require('../../models/PostModel');

app.use(bodyParser.urlencoded({ extended: false }));

// get all posts
router.get('/', async (req, res, next) => {
  const searchObj = req.query;
  const { user } = req.session;
  /* based on if req.query is passing isReply, if yes, check if its value, if true, use MongoDB syntax to mutate if the replyTo exists or not, then remove the isReply from searchObj */
  if (searchObj.isReply !== undefined) {
    const isReply = searchObj.isReply === 'true';
    searchObj.replyTo = { $exists: isReply };
    delete searchObj.isReply;
  }

  if (searchObj.followingOnly !== undefined) {
    const followingOnly = searchObj.followingOnly === 'true';

    if (followingOnly) {
      let objectIds = [];

      if (!user.followings) {
        user.followings = [];
      }

      user.followings.forEach((followingUser) => {
        objectIds.push(followingUser);
      });

      objectIds.push(user._id);
      searchObj.postedBy = { $in: objectIds };
    }
    delete searchObj.followingOnly;
  }

  const results = await getPosts(searchObj);
  res.status(200).send(results);
});

// get specific post
router.get('/:id', async (req, res, next) => {
  const postId = req.params.id;
  try {
    let postData = await getPosts({ _id: postId });
    postData = postData[0];

    const posts = { postData: postData };

    if (postData.replyTo) {
      posts.replyTo = postData.replyTo;
    }

    posts.replies = await getPosts({ replyTo: postId });

    res.status(200).send(posts);
  } catch (error) {
    console.log('posts.js route GET request of specific post error: ', error);
  }
});

// create new post
router.post('/', async (req, res, next) => {
  if (!req.body.content) {
    console.log('new post/reply content param is null for posts POST request');
    return res.sendStatus(400);
  }

  const postData = {
    content: req.body.content,
    postedBy: req.session.user,
  };

  if (req.body.replyTo) {
    postData.replyTo = req.body.replyTo;
  }

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

// update likes in post collection
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

    return res.status(200).send(post);
  } catch (error) {
    console.log('post like PUT request error >>> ', error);
    res.sendStatus(400);
  }
});

// create new repost
router.post('/:id/repost', async (req, res, next) => {
  try {
    const postId = req.params.id;
    const userId = req.session.user._id;

    const deletedPost = await Post.findOneAndDelete({
      postedBy: userId,
      repostData: postId,
    });

    const option = deletedPost !== null ? '$pull' : '$addToSet';
    let repost = deletedPost;

    if (!repost) {
      repost = await Post.create({ postedBy: userId, repostData: postId });
    }

    req.session.user = await User.findByIdAndUpdate(
      userId,
      { [option]: { reposts: repost._id } },
      { new: true }
    );

    const post = await Post.findByIdAndUpdate(
      postId,
      { [option]: { repostedBy: userId } },
      { new: true }
    );

    return res.status(200).send(post);
  } catch (error) {
    console.log('post repost POST request error >>> ', error);
    res.sendStatus(400);
  }
});

// delete existing post
router.delete('/:id', async (req, res, next) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.sendStatus(202);
  } catch (error) {
    console.log('posts DELETE request error: ', error);
    res.sendStatus(400);
  }
});

// get post details with specific filters
const getPosts = async (postFilter) => {
  try {
    let posts = await Post.find(postFilter)
      .populate('postedBy')
      .populate('repostData')
      .populate('replyTo')
      .sort({ createdAt: -1 });
    if (posts) {
      posts = await User.populate(posts, { path: 'replyTo.postedBy' });

      return await User.populate(posts, {
        path: 'repostData.postedBy',
      });
    }
  } catch (error) {
    console.log('posts GET request error >>> ', error);
  }
};

module.exports = router;
