const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // dest stands for destination
const path = require('path');
const fs = require('fs');
const User = require('../../models/UserModel');
const Post = require('../../models/PostModel');

app.use(bodyParser.urlencoded({ extended: false }));

// get all follow
router.put('/:userId/follow', async (req, res, next) => {
  try {
    let { userId } = req.params;
    let user = await User.findById(userId);

    if (!user) {
      return res.sendStatus(404);
    }

    const isFollowing =
      user.followers && user.followers.includes(req.session.user._id);

    const option = isFollowing ? '$pull' : '$addToSet';

    req.session.user = await User.findByIdAndUpdate(
      req.session.user._id,
      { [option]: { followings: userId } },
      { new: true }
    );

    await User.findByIdAndUpdate(userId, {
      [option]: { followers: req.session.user._id },
    });

    res.status(200).send(req.session.user);
  } catch (error) {
    console.log('users API route PUT request error: ', error);
    res.sendStatus(400);
  }
});

// get user's followings
router.get('/:userId/following', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userNetwork = await User.findById(userId).populate('followings');
    if (userNetwork) {
      res.status(200).send(userNetwork);
    }
  } catch (error) {
    console.log('users route following GET request error: ', error);
    res.sendStatus(400);
  }
});

// get user's followers
router.get('/:userId/followers', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userNetwork = await User.findById(userId).populate('followers');
    if (userNetwork) {
      res.status(200).send(userNetwork);
    }
  } catch (error) {
    console.log('users route followers GET request error: ', error);
    res.sendStatus(400);
  }
});

// create user profile image, .single method is for uploading single file
router.post(
  '/profileImage',
  upload.single('croppedImage'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        console.log('No file uploaded with ajax request');
        return res.sendStatus(400);
      }

      let filePath = `/uploads/images/${req.file.filename}.png`;
      let tempPath = req.file.path;
      let targetPath = path.join(__dirname, `../../${filePath}`);

      fs.rename(tempPath, targetPath, async (error) => {
        if (error) {
          console.log('fs.rename error: ', error);
          return res.sendStatus(400);
        }

        req.session.user = await User.findByIdAndUpdate(
          req.session.user._id,
          { profileImage: filePath },
          { new: true }
        );

        res.sendStatus(204);
      });
    } catch (error) {
      console.log('users route profile image POST request error: ', error);
      res.sendStatus(400);
    }
  }
);

module.exports = router;
