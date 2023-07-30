const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/UserModel');

// logged in user's profile
router.get('/', async (req, res, next) => {
  const { user } = req.session;
  try {
    const payload = {
      pageTitle: user.username,
      loggedInUser: user,
      loggedInUserJS: JSON.stringify(user),
      profileUser: user,
    };
    res.status(200).render('profile', payload);
  } catch (error) {
    console.log('profile route GET request error: ', error);
  }
});

// get specific user's profile details
router.get('/:username', async (req, res, next) => {
  try {
    const { username } = req.params;
    const { user } = req.session;
    const payload = await getPayload(username, user);
    res.status(200).render('profile', payload);
  } catch (error) {
    console.log('profile route GET request error: ', error);
  }
});

// get user profile replies tab
router.get('/:username/replies', async (req, res, next) => {
  try {
    const { username } = req.params;
    const { user } = req.session;
    const payload = await getPayload(username, user);

    payload.selectedTab = 'replies';

    res.status(200).render('profile', payload);
  } catch (error) {
    console.log('profile route GET request error: ', error);
  }
});

// get user network followings
router.get('/:username/following', async (req, res, next) => {
  try {
    const { username } = req.params;
    const { user } = req.session;
    const payload = await getPayload(username, user);

    payload.selectedTab = 'following';

    res.status(200).render('followersAndFollowings', payload);
  } catch (error) {
    console.log('profile route following GET request error: ', error);
  }
});

// get user network followers
router.get('/:username/followers', async (req, res, next) => {
  try {
    const { username } = req.params;
    const { user } = req.session;
    const payload = await getPayload(username, user);

    payload.selectedTab = 'followers';

    res.status(200).render('followersAndFollowings', payload);
  } catch (error) {
    console.log('profile route followers GET request error: ', error);
  }
});

const getPayload = async (username, loggedInUser) => {
  try {
    let user = await User.findOne({ username: username });

    let payload = {
      loggedInUser: loggedInUser,
      loggedInUserJS: JSON.stringify(loggedInUser),
    };

    if (!user) {
      user = await User.findById(username);
      if (!user) {
        payload.pageTitle = 'User not found';
        return payload;
      }
    }

    payload.pageTitle = user.username;
    payload.profileUser = user;

    return payload;
  } catch (error) {
    console.log('getPayload function error: ', error);
  }
};

module.exports = router;
