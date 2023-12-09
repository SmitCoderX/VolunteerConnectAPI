const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Events = require('../models/Events');
//  @desc   Get All Events
//  @route  GET /api/v1/events
// @access  Public
exports.getEvents = asyncHandler(async (req, res, next) => {
  let query;

  // Copy Req Query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort'];

  // Loop over remove fields and delete them from request query
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create Query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resources
  query = Events.find(JSON.parse(queryStr));

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Executing query
  const events = await query;
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
// @access  Private
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

//  @desc   Get Events within the radius
//  @route  DELETE /api/v1/events/radius/:lat/:long/:distance
// @access  Public
exports.getEventsInRadius = asyncHandler(async (req, res, next) => {
  const { lat, long, distance } = req.params;

  // Calc Radius using radians
  // Divide distance by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 kms
  const radius = distance / 6378;

  const events = await Events.find({
    location: {
      $geoWithin: { $centerSphere: [[lat, long], radius] },
    },
  });

  res.status(200).json({
    success: true,
    count: events.length,
    data: events,
  });
});
