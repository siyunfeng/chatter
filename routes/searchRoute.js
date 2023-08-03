const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../models/UserModel');

router.get('/', async (req, res, next) => {
  const { user } = req.session;

  let payload = createPayload(user);
  res.status(200).render('searchPage', payload);
});

router.get('/:selectedTab', async (req, res, next) => {
  const { selectedTab } = req.params;
  const { user } = req.session;

  let payload = createPayload(user);
  payload.selectedTab = selectedTab;
  res.status(200).render('searchPage', payload);
});

const createPayload = (user) => {
  return {
    pageTitle: 'Search',
    loggedInUser: user,
    loggedInUserJS: JSON.stringify(user),
  };
};

module.exports = router;
