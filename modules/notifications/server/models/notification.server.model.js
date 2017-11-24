'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Notification Schema
 */
var NotificationSchema = new Schema({
  data: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now
  },
  userList: {
    type: [String]
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Notification', NotificationSchema);
