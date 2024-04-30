const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Volunteer = require('../models/Volunteer');
const Events = require('../models/Events');
const Forum = require('../models/Forum');
const { default: mongoose } = require('mongoose');

// @desc    Send Request
// @route   POST /api/v1/sendRequest
// @access  Private
exports.sendRequest = asyncHandler(async (req, res, next) => {
  var ObjectId = require('mongoose').Types.ObjectId;
  req.body.requester = req.user.id;

  const existingRequest = await Volunteer.findOne({
    recipient: new ObjectId(req.body.recipient),
    requester: req.user.id,
  });

  if (existingRequest) {
    return next(new ErrorResponse(`Already Sended the Request`, 403));
  } else {
    const request = await Volunteer.create(req.body);
    res.status(201).json({
      success: true,
      data: request,
    });
  }
});

// @desc    Accept or Decline Request
// @route   PUT /api/v1/request/:id
// @access  Private
exports.requestStatus = asyncHandler(async (req, res, next) => {
  let request = await Volunteer.findById(req.params.id);
  let event = await Events.findById(request.recipient);
  let forum = await Forum.findById(event.forumId);
  let message = '';
  if (!request) {
    return next(
      new ErrorResponse(`Request Not Found with id of ${req.params.id}`, 404)
    );
  }

  if (!event) {
    return next(
      new ErrorResponse(`Event Not Found with id of ${request.recipient}`, 404)
    );
  }

  if (!forum) {
    return next(
      new ErrorResponse(`Forum Not Found with id of ${event.forumId}`, 404)
    );
  }

  // Make sure user is event owner
  if (event.user + '' !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to update this event`,
        401
      )
    );
  }

  request = await Volunteer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (req.body.status === 2) {
    message = 'Request Accepted';
    if (
      !forum.participants.includes(request.requester) &&
      !forum.participants.includes(request.recipient)
    ) {
      forum = await Forum.findOneAndUpdate(
        { _id: event.forumId },
        { $push: { participants: request.requester } }
      );
      event = await Events.findOneAndUpdate(
        { _id: request.recipient },
        { $push: { volunteers: request.requester } }
      );
    } else {
      return next(new ErrorResponse(`User Already in the Forum`, 403));
    }
  } else {
    message = 'Request Rejected';
  }

  res.status(200).json({
    success: true,
    message: message,
  });
});

// @desc    Get Recipient Request List
// @route   GET /api/v1/recipientRequests/:id
// @access  Private

exports.getRecipientRequestes = asyncHandler(async (req, res, next) => {
  var ObjectId = require('mongoose').Types.ObjectId;

  const requestes = await Volunteer.find({
    recipient: new ObjectId(req.params.id),
  });
  res.status(200).json({
    success: true,
    message: requestes,
  });
});

// @desc    Get Requester Request List
// @route   GET /api/v1/requesterRequests/:id
// @access  Private

exports.getRequesterRequestes = asyncHandler(async (req, res, next) => {
  var ObjectId = new require('mongoose').Types.ObjectId;

  const requestes = await Volunteer.find({
    requester: new ObjectId(req.params.id),
  });

  res.status(200).json({
    success: true,
    message: requestes,
  });
});
