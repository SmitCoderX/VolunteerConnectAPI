const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Volunteer = require('../models/Volunteer');
const Events = require('../models/Events');

// @desc    Send Request
// @route   POST /api/v1/sendRequest
// @access  Private
exports.sendRequest = asyncHandler(async (req, res, next) => {
  req.body.requester = req.user.id;
  const request = await Volunteer.create(req.body);

  res.status(201).json({
    success: true,
    data: request,
  });
});

// @desc    Accept or Decline Request
// @route   PUT /api/v1/request/:id
// @access  Private
exports.requestStatus = asyncHandler(async (req, res, next) => {
  let request = await Volunteer.findById(req.params.id);
  let event = await Events.findById(request.recipient);
  let message = '';
  if (!request) {
    return next(
      new ErrorResponse(`Request Not Found with id of ${req.params.id}`, 404)
    );
  }

  if (!event) {
    return next(
      new ErrorResponse(`Event Not Found with id of ${req.params.id}`, 404)
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
    event = await Events.findOneAndUpdate(
      { _id: request.recipient },
      { $push: { volunteers: request.requester } }
    );
    if (event) {
      message = 'Request Accepted';
    } else {
      return next(
        new ErrorResponse(
          `Event Not Found with id of ${request.recipient}`,
          404
        )
      );
    }
  } else {
    message = 'Request Rejected';
  }

  res.status(200).json({
    success: true,
    message: message,
  });
});
