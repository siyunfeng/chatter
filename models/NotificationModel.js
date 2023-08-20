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

NotificationModel.statics.insertNotification = async (
  toUser,
  fromUser,
  notificationType,
  entityId
) => {
  let data = {
    toUser,
    fromUser,
    notificationType,
    entityId,
  };
  try {
    await Notification.deleteOne(data);
    return Notification.create(data);
  } catch (error) {
    console.log('Notification.static.insertNotification error: ', error);
  }
};

const Notification = model('Notification', NotificationModel);

module.exports = Notification;
