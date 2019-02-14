var mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ConferenceSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  submitDate: {
    type: Date,
    required: false
  },
  submittedBy: {
    type: String,
    required: false
  }
});
module.exports = mongoose.model('conference', ConferenceSchema, 'confSchame');