const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const UserModel = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    profileImg: { type: String, default: '/images/defaultProfileImg.png' },
  },
  { timestamps: true }
);

const User = model('User', UserModel);

module.exports = User;