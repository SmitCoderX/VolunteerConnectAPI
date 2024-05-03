const mongoose = require('mongoose');
const slugify = require('slugify');

const ForumSchema = new mongoose.Schema({
  forumName: {
    type: String,
    required: [true, 'Please Provide a Forum Name'],
    trim: true,
  },
  forumImg: {
    type: String,
    default: 'no-photo.jpg',
  },
  slug: String,
  desc: String,
  event: {
    type: mongoose.Schema.ObjectId,
    ref: 'Events',
    required: true,
  },
  eventName: {
    type: String,
  },
  userId: {
    type: String,
  },
  posts: {
    type: [mongoose.Schema.ObjectId],
    ref: 'Posts',
  },
  participants: {
    type: [mongoose.Schema.ObjectId],
    ref: 'Users',
  },
});

ForumSchema.pre('save', function (next) {
  this.slug = slugify(this.forumName, { lower: true });
  next();
});

module.exports = mongoose.model('Forum', ForumSchema);
