const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a Name'],
    unique: true,
    trim: true,
  },
  slug: String,
  desc: {
    type: String,
    // required: [true, 'Please add a Name'],
  },
  category: {
    type: [String],
    // required: true,
    enum: ['Food', 'Charity', 'Clothes', 'Teaching', 'Others'],
  },
  address: {
    type: String,
    // required: [true, 'Please add an address'],
  },
  photos: {
    type: [String],
    default: 'no-photo.jpg',
  },
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ['Point'],
      // required: true,
    },
    coordinates: {
      type: [Number],
      // required: true,
      index: '2dsphere',
    },
  },
  phone: {
    type: String,
    // required: [true, 'Please Specify Phone Number'],
    maxlength: [20, 'Phone Number cannot be longer than 20 characters'],
  },
  email: {
    type: String,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please use a valid URL with HTTP or HTTPS',
    ],
  },
  formattedAddress: String,
  street: String,
  city: String,
  state: String,
  zipcode: String,
  country: String,
  volunteerCount: {
    type: Number,
    // required: [true, 'Please Specify the number of volunteer required'],
  },
  isPaid: {
    type: Boolean,
    // required: [true, 'Please Specify event is Paid or Not'],
  },
  price: String,
  isPaying: {
    type: Boolean,
    // required: [true, 'Please Specify Event is Paying or Not'],
  },
  payment: String,
  visibility: {
    type: String,
    // required: [true, 'Please Specifiy the Visibility of the Event'],
    enum: ['private', 'public', 'invitesOnly'],
  },
  isGoodiesProvided: {
    type: Boolean,
    // required: [true, 'Please Specifiy if Goodies will be provided or Not'],
  },
  goodies: String,
  eventPoint: Number,
  eventStartDataAndTime: {
    type: Date,
    // required: [true, 'Please Specify the Event Starting Date and Time'],
  },
  eventEndingDateAndTime: {
    type: Date,
    // required: [true, 'Please Specify the Event Ending Date and Time.'],
  },
  isStarted: Boolean,
  isEnded: Boolean,
  isLive: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Events', EventSchema);
