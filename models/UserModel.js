const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserModel = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String, default: '/images/defaultprofileImage.png' },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    reposts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    followings: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const User = model('User', UserModel);

module.exports = User;
