const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const User = require('../../models/UserModel');
const Post = require('../../models/PostModel');
const Chat = require('../../models/ChatModel');
const Message = require('../../models/MessageModel');
const Notification = require('../../models/NotificationModel');

app.use(bodyParser.urlencoded({ extended: false }));

router.get('/', async (req, res, next) => {
  try {
    let search = {
      toUser: req.session.user._id,
      notificationType: { $ne: 'newMessage' },
    };

    if (req.query.unreadOnly) {
      search.read = false;
    }

    let newNotification = await Notification.find(search)
      .populate('toUser')
      .populate('fromUser')
      .sort({ createdAt: -1 });

    res.status(200).send(newNotification);
  } catch (error) {
    console.log('/api/notifications route GET request error: ', error);
    res.sendStatus(400);
  }
});

router.get('/latest', async (req, res, next) => {
  try {
    let newNotification = await Notification.findOne({
      toUser: req.session.user._id,
    })
      .populate('toUser')
      .populate('fromUser')
      .sort({ createdAt: -1 });

    res.status(200).send(newNotification);
  } catch (error) {
    console.log('/api/notifications route GET request error: ', error);
    res.sendStatus(400);
  }
});

// update notification as read
router.put('/:id/read', async (req, res, next) => {
  try {
    const { id } = req.params;
    await Notification.findByIdAndUpdate(id, { read: true });

    res.sendStatus(204);
  } catch (error) {
    console.log(
      '/api/notifications route specific notification PUT request error: ',
      error
    );
    res.sendStatus(400);
  }
});

// update all notifications as read
router.put('/read', async (req, res, next) => {
  try {
    await Notification.updateMany(
      { toUser: req.session.user._id },
      { read: true }
    );

    res.sendStatus(204);
  } catch (error) {
    console.log(
      '/api/notifications route all notifications PUT request error: ',
      error
    );
    res.sendStatus(400);
  }
});

module.exports = router;
