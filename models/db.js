const mongoose = require('mongoose');

// EXAMPLE STRING: mongodb://username:password@hostname:port/database
mongoose.connect('mongodb://cordellradke:abc123@ds117545.mlab.com:17545/grades', { useNewUrlParser: true });

require('./gradeModel');

// Get the default connection
var db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('DATABASE CONNECTED SUCCESSFULLY') );


module.exports = db;
