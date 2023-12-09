const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// Load Env Vars
dotenv.config({ path: './config/config.env' });

// Load Models
const Events = require('./models/Events');
// Connect to DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON Files
const event = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/events.json`, 'utf-8')
);

// Import into DB
const importData = async () => {
  try {
    await Events.create(event);

    console.log('Data Imported...'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete Data
const deleteData = async () => {
  try {
    await Events.deleteMany();

    console.log('Data Destroyed...'.red.inverse);
    process.exit();
  } catch (err) {
    log(err);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
