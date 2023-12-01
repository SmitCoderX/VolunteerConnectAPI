const Events = require('../models/Events');
const ErrorResponse = require('../utils/errorResponse');

//  @desc   Get All Events
//  @route  GET /api/v1/events
// @access  Public
exports.getEvents = async (req, res, next) => {
  try {
    const events = await Events.find();
    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

//  @desc   Get Single Events
//  @route  GET /api/v1/events/:id
// @access  Public
exports.getEvent = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
  }
};

//  @desc   Create New Events
//  @route  POST /api/v1/events/
// @access  Private
exports.createEvent = async (req, res, next) => {
  try {
    const create = await Events.create(req.body);
    res.status(201).json({
      success: true,
      data: create,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
    });
  }
};

//  @desc   Update Event
//  @route  PUT /api/v1/events/:id
// @access  Private
exports.updateEvent = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
  }
};

//  @desc   Delete Event
//  @route  DELETE /api/v1/events/:id
// @access  Public
exports.deleteEvent = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(new ErrorResponse(`Event not found with id of ${req.params.id}`, 404));
  }
};
