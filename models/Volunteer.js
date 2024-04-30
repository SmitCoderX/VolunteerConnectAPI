const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  recipient: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  eventId: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  eventName: {
    type: String,
    required: true,
  },
  appliedBy: {
    type: String,
    required: true,
  },
  answers: [
    {
      type: Map,
      of: String,
      default: {},
    },
  ],
  // Here 1 = Requested, 2 = Accepted, 3 = Rejected
  status: {
    type: Number,
  },
  transactionId: {
    type: String,
  },
});

module.exports = mongoose.model('Volunteer', VolunteerSchema);
