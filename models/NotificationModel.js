const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const NotificationModel = new Schema(
  {
    toUser: { type: Schema.Types.ObjectId, ref: 'User' },
    fromUser: { type: Schema.Types.ObjectId, ref: 'User' },
    notificationType: String,
    opened: { type: Boolean, default: false },
    entityId: Schema.Types.ObjectId,
  },
  { timestamps: true }
);

const Notification = model('Notification', NotificationModel);

module.exports = Notification;
