'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Event Schema
 */
var EventSchema = new Schema({
  eventName: {
    type: String,
    default: 'Business name'    // check this
  },
  business: {
    type: String
  },
  dateOfEvent: {
    type: String
  },
  timeOfEvent: {
    type: String
  },
  locationOfEvent: {
    type: String
  },
  organizationsPending: [{
    organizationName: String
  }],
  organizationConfirmed: {
    type: String
  },
  eventImage: {    // check this
    type: String,
    default: 'modules/users/client/img/profile/default.png'   // business avatar
  },
  businessContact: {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    phoneNumber: {
      type: String
    }
  },
  organizationContact: {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    phoneNumber: {
      type: String
    }
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Event', EventSchema);
