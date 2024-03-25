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
  answers: {
    type: Map,
    of: String,
    default: {},
  },
  // Here 1 = Requested, 2 = Accepted, 3 = Rejected
  status: {
    type: Number,
  },
});

module.exports = mongoose.model('Volunteer', VolunteerSchema);
