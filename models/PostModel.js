const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PostModel = new Schema(
  {
    content: { type: String, trim: true },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    pinned: Boolean,
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const Post = model('Post', PostModel);

module.exports = Post;