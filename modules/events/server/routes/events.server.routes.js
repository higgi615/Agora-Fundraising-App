'use strict';

/**
 * Module dependencies
 */
var eventsPolicy = require('../policies/events.server.policy'),
  events = require('../controllers/events.server.controller');

module.exports = function (app) {
  // Events Routes
  app.route('/api/events').get(events.list)
    .post(events.create);

  app.route('/api/events/:eventId').get(events.read)
    .put(events.update)
    .delete(events.delete);

  // Finish by binding the Event middleware
  app.param('eventId', events.eventByID);
};
