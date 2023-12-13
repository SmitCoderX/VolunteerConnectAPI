const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load Env vars
dotenv.config({ path: './config/config.env' });

//  Connect to Database
connectDB();

// Route files
const events = require('./routes/events');
const auth = require('./routes/auth');

const app = express();

//Body Parser
app.use(express.json());

// Dev Loggin Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
// Mount routers
app.use('/api/v1/events', events);
app.use('/api/v1/auth', auth);

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
