const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const fileupload = require('express-fileupload');
const path = require('path');

// Load Env vars
dotenv.config({ path: './config/config.env' });

//  Connect to Database
connectDB();

// Route files
const events = require('./routes/events');
const auth = require('./routes/auth');
const users = require('./routes/users');
const category = require('./routes/category');
const forum = require('./routes/forum');
const volunteer = require('./routes/volunteer');
const posts = require('./routes/posts');

const app = express();

//Body Parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Dev Loggin Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// File Uploading
app.use(fileupload());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/v1/events', events);
app.use('/api/v1/auth', auth);
app.use('/api/v1/user', users);
app.use('/api/v1/category', category);
app.use('/api/v1/forum', forum);
app.use('/api/v1/volunteer', volunteer);
app.use('/api/v1/posts', posts);

// Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

//  Handle Unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red);

  //  Close Server and Exit Process
  server.close(() => process.exit(1));
});
