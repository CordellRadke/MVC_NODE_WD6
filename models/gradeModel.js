const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create Schema for model
var gradeSchema = new Schema({
    studentname: {type: String, require:true},
    studentpercent: {type: Number, require:true, min: 0, max: 100},
    studentlettergrade: {type: String, require:true}
});

//create model using Schema
var Grade = mongoose.model('Grade', gradeSchema);

//make available for users
module.exports = Grade;