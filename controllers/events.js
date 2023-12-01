const Events = require('../models/Events');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
//  @desc   Get All Events
//  @route  GET /api/v1/events
// @access  Public
exports.getEvents = asyncHandler(async (req, res, next) => {
  const events = await Events.find();
  res.status(200).json({
    success: true,
    count: events.length,
    data: events,
  });
});

//  @desc   Get Single Events
//  @route  GET /api/v1/events/:id
// @access  Public
exports.getEvent = asyncHandler(async (req, res, next) => {
  const event = await Events.findById(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: event,
  });
});

//  @desc   Create New Events
//  @route  POST /api/v1/events/
// @access  Private
exports.createEvent = asyncHandler(async (req, res, next) => {
  const create = await Events.create(req.body);
  res.status(201).json({
    success: true,
    data: create,
  });
});

//  @desc   Update Event
//  @route  PUT /api/v1/events/:id
// @access  Private
exports.updateEvent = asyncHandler(async (req, res, next) => {
  const event = await Events.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: event,
  });
});

//  @desc   Delete Event
//  @route  DELETE /api/v1/events/:id
// @access  Public
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const event = await Events.findByIdAndDelete(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: [],
  });
});
