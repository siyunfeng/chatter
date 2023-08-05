const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ChatModel = new Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    latestMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  },
  { timestamps: true }
);

const Chat = model('Chat', ChatModel);

module.exports = Chat;
