const mongoose = require('mongoose');
const slugify = require('slugify');

const PostSchema = new mongoose.Schema({
  postName: {
    type: String,
  },
  postImg: {
    type: String,
  },
  postDetails: {
    type: String,
  },
  forumId: {
    type: String,
  },
  forumName: {
    type: String,
  },
  createdByName: {
    type: String,
  },
  createdByProfile: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

PostSchema.pre('save', function (next) {
  this.slug = slugify(this.forumName, { lower: true });
  next();
});

module.exports = mongoose.model('Post', PostSchema);
