const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PostModel = new Schema(
  {
    content: { type: String, trim: true },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    pinned: Boolean,
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    repostedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    repostData: { type: Schema.Types.ObjectId, ref: 'Post' },
  },
  { timestamps: true }
);

const Post = model('Post', PostModel);

module.exports = Post;
