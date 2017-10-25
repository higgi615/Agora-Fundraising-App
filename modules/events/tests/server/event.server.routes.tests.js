'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Events = mongoose.model('Event'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  events;

/**
 * Events routes tests
 */
describe('Events CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Events
    user.save(function () {
      events = {
        name: 'Events name'
      };

      done();
    });
  });

  it('should be able to save a Events if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Events
        agent.post('/api/eventss')
          .send(events)
          .expect(200)
          .end(function (eventsSaveErr, eventsSaveRes) {
            // Handle Events save error
            if (eventsSaveErr) {
              return done(eventsSaveErr);
            }

            // Get a list of Eventss
            agent.get('/api/eventss')
              .end(function (eventssGetErr, eventssGetRes) {
                // Handle Eventss save error
                if (eventssGetErr) {
                  return done(eventssGetErr);
                }

                // Get Eventss list
                var eventss = eventssGetRes.body;

                // Set assertions
                (eventss[0].user._id).should.equal(userId);
                (eventss[0].name).should.match('Events name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Events if not logged in', function (done) {
    agent.post('/api/eventss')
      .send(events)
      .expect(403)
      .end(function (eventsSaveErr, eventsSaveRes) {
        // Call the assertion callback
        done(eventsSaveErr);
      });
  });

  it('should not be able to save an Events if no name is provided', function (done) {
    // Invalidate name field
    events.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Events
        agent.post('/api/eventss')
          .send(events)
          .expect(400)
          .end(function (eventsSaveErr, eventsSaveRes) {
            // Set message assertion
            (eventsSaveRes.body.message).should.match('Please fill Events name');

            // Handle Events save error
            done(eventsSaveErr);
          });
      });
  });

  it('should be able to update an Events if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Events
        agent.post('/api/eventss')
          .send(events)
          .expect(200)
          .end(function (eventsSaveErr, eventsSaveRes) {
            // Handle Events save error
            if (eventsSaveErr) {
              return done(eventsSaveErr);
            }

            // Update Events name
            events.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Events
            agent.put('/api/eventss/' + eventsSaveRes.body._id)
              .send(events)
              .expect(200)
              .end(function (eventsUpdateErr, eventsUpdateRes) {
                // Handle Events update error
                if (eventsUpdateErr) {
                  return done(eventsUpdateErr);
                }

                // Set assertions
                (eventsUpdateRes.body._id).should.equal(eventsSaveRes.body._id);
                (eventsUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Eventss if not signed in', function (done) {
    // Create new Events model instance
    var eventsObj = new Events(events);

    // Save the events
    eventsObj.save(function () {
      // Request Eventss
      request(app).get('/api/eventss')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Events if not signed in', function (done) {
    // Create new Events model instance
    var eventsObj = new Events(events);

    // Save the Events
    eventsObj.save(function () {
      request(app).get('/api/eventss/' + eventsObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', events.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Events with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/eventss/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Events is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Events which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Events
    request(app).get('/api/eventss/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Events with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Events if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Events
        agent.post('/api/eventss')
          .send(events)
          .expect(200)
          .end(function (eventsSaveErr, eventsSaveRes) {
            // Handle Events save error
            if (eventsSaveErr) {
              return done(eventsSaveErr);
            }

            // Delete an existing Events
            agent.delete('/api/eventss/' + eventsSaveRes.body._id)
              .send(events)
              .expect(200)
              .end(function (eventsDeleteErr, eventsDeleteRes) {
                // Handle events error error
                if (eventsDeleteErr) {
                  return done(eventsDeleteErr);
                }

                // Set assertions
                (eventsDeleteRes.body._id).should.equal(eventsSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Events if not signed in', function (done) {
    // Set Events user
    events.user = user;

    // Create new Events model instance
    var eventsObj = new Events(events);

    // Save the Events
    eventsObj.save(function () {
      // Try deleting Events
      request(app).delete('/api/eventss/' + eventsObj._id)
        .expect(403)
        .end(function (eventsDeleteErr, eventsDeleteRes) {
          // Set message assertion
          (eventsDeleteRes.body.message).should.match('User is not authorized');

          // Handle Events error error
          done(eventsDeleteErr);
        });

    });
  });

  it('should be able to get a single Events that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Events
          agent.post('/api/eventss')
            .send(events)
            .expect(200)
            .end(function (eventsSaveErr, eventsSaveRes) {
              // Handle Events save error
              if (eventsSaveErr) {
                return done(eventsSaveErr);
              }

              // Set assertions on new Events
              (eventsSaveRes.body.name).should.equal(events.name);
              should.exist(eventsSaveRes.body.user);
              should.equal(eventsSaveRes.body.user._id, orphanId);

              // force the Events to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Events
                    agent.get('/api/eventss/' + eventsSaveRes.body._id)
                      .expect(200)
                      .end(function (eventsInfoErr, eventsInfoRes) {
                        // Handle Events error
                        if (eventsInfoErr) {
                          return done(eventsInfoErr);
                        }

                        // Set assertions
                        (eventsInfoRes.body._id).should.equal(eventsSaveRes.body._id);
                        (eventsInfoRes.body.name).should.equal(events.name);
                        should.equal(eventsInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Events.remove().exec(done);
    });
  });
});
