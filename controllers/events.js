const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Events = require('../models/Events');
const path = require('path');
const Forum = require('../models/Forum');

//  @desc   Get All Events
//  @route  GET /api/v1/events
// @access  Public
exports.getEvents = asyncHandler(async (req, res, next) => {
  let query;

  // Copy Req Query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

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

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Events.countDocuments();

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const events = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.status(200).json({
    success: true,
    count: events.length,
    pagination,
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
//  @access  Private
exports.createEvent = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;
  let create = await Events.create(req.body);
  if (req.body.isForumCreated === true) {
    const createForum = await Forum.create({
      forumName: req.body.forumName,
      event: create._id,
      participants: req.user.id,
    });
    await Events.updateOne(
      { _id: create._id },
      { $set: { forumId: createForum.id } }
    );
  }
  res.status(201).json({
    success: true,
    message: 'Event Created Successfully',
  });
});

//  @desc   Update Event
//  @route  PUT /api/v1/events/:id
// @access  Private
exports.updateEvent = asyncHandler(async (req, res, next) => {
  let event = await Events.findById(req.params.id);
  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
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

  event = await Events.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: event,
  });
});

//  @desc   Delete Event
//  @route  DELETE /api/v1/events/:id
// @access  Private
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  let event = await Events.findById(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is event owner
  if (event.user + '' !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.params.id} is not authorized to delete this event`,
        401
      )
    );
  }

  event.remove();

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
    coordinates: {
      $geoWithin: { $centerSphere: [[lat, long], radius] },
    },
  });

  res.status(200).json({
    success: true,
    count: events.length,
    data: events,
  });
});

//  @desc   Upload Photo for the Event
//  @route  PUT /api/v1/events/:id/photo
// @access  Private
exports.eventUploadPhoto = asyncHandler(async (req, res, next) => {
  let event = await Events.findById(req.params.id);

  if (!event) {
    return next(
      new ErrorResponse(`Event not found with id of ${req.params.id}`, 404)
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please Upload a file`, 400));
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

  const file = req.files.file;

  // Make sure the image is a photo
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse(`Please Upload an Image File`, 400));
  }

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please Upload an image with less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  // Create Custom File Name
  file.name = `photo_${event._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse('Problem with file Upload', 500));
    }
    await Events.findByIdAndUpdate(req.params.id, { eventPicture: file.name });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
