'use strict';

angular.module('core').controller('HomeController', ['$scope', '$compile', '$window', '$state', '$http', 'Authentication',
  function ($scope, $compile, $window, $state, $http, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.events = [];

    /* Render Tooltip */
    $scope.eventRender = function (event, element, stick) {
      element.attr({
        'tooltip': event.title,
        'tooltip-append-to-body': true
      });
      $compile(element)($scope);
    };

    $scope.uiConfig = {
      calendar: {
        defaultTimedEventDuration: '01:00:00',
        height: 700,
        editable: false,
        header: {
          left: 'title',
          center: '',
          right: 'today prev,next'
        },

        eventRender: $scope.eventRender
      }
    };

    //Initialize some variables
    $scope.editEvent_flag = 0;


    $scope.name = null;
    $scope.date = null;
    $scope.eTime = null;
    $scope.sTime = null;
    $scope.requireTax = null;

    $scope.acceptEvent_flag = 0;

    $scope.eventList = [
      {
        bizName: 'Blaze',
        date: '10/17/17',
        status: 'Pending'
      }, {
        bizName: 'Taco Bell',
        date: '11/12/23',
        status: 'Confirmed'
      }, {
        bizName: 'Blaze',
        date: '10/17/17',
        status: 'Pending'
      }, {
        bizName: 'Taco Bell',
        date: '11/12/23',
        status: 'Confirmed'
      }];


    //Sends a delete request to remove a passed in event from the DB
    $scope.deleteEvent = function (event) {
      if ($window.confirm('Are you sure you want to delete?')) {

        $http({
          method: 'DELETE',
          url: 'api/events/' + event._id
        }).then(function (res) {
          console.log('Successful delete');
        }, function (res) {
          console.log('Failed delete');
        });
      }

      $scope.loadEventList();
    };

    //Adds the organization name to the organizationsPending list
    $scope.requestEvent = function (event) {
      if (event.organizationsPending.indexOf($scope.authentication.user.displayName) === -1) {
        event.organizationsPending.push($scope.authentication.user.displayName);
      } else {
        return;
      }
      $http({
        method: 'PUT',
        url: 'api/events/' + event._id,
        data: {
          organizationsPending: event.organizationsPending
        }
      }).then(function (res) {
        console.log('Successful request');
      }, function (res) {
        console.log('Failed request');
        console.log(res);
      });
    };

    //Determines whether or not the current user is confirmed for an event
    $scope.generateStatus = function (event) {
      if (event.organizationConfirmed === $scope.authentication.user.displayName) {
        return 'Accepted';
      } else {
        return 'Pending';
      }
    };

    //Allows a business to change the confirmed org based on it's index in the organizationsPending array
    $scope.acceptEvent = function (index) {
      if ($scope.globalEvent.organizationsPending.length === 0) {
        return;
      }
      $http({
        method: 'PUT',
        url: 'api/events/' + $scope.globalEvent._id,
        data: {
          organizationConfirmed: $scope.globalEvent.organizationsPending[index]
        }
      }).then(function (res) {
        console.log('Successful accept');
        console.log(index);
        console.log($scope.globalEvent);
        console.log($scope.globalEvent.organizationsPending[index]);
      }, function (res) {
        console.log('Failed accept');
        console.log(res);
      });
    };

    //Returns true if the organization's name is not on the organizationsPending array
    $scope.displayOrgNonRequest = function (event) {
      console.log($scope.eventList);
      console.log(event.organizationsPending === []);
      if (event.organizationsPending === []) {
        return true;
      }
      return event.organizationsPending.indexOf($scope.authentication.user.displayName) === -1;
    };

    //Allows an organizations to delete their name from the event that is passed in
    $scope.deleteOrgRequest = function (event) {
      console.log(event.organizationsPending.splice(event.organizationsPending.indexOf($scope.authentication.user.displayName), 1));
      var newConfirmed = event.organizationConfirmed;
      if (newConfirmed === $scope.authentication.user.displayName) {
        newConfirmed = '';
      }
      $http({
        method: 'PUT',
        url: 'api/events/' + event._id,
        data: {
          organizationsPending: event.organizationsPending.splice(event.organizationsPending.indexOf($scope.authentication.user.displayName), 1),
          organizationConfirmed: newConfirmed
        }
      }).then(function (res) {
        console.log('Successful org event delete');
      }, function (res) {
        console.log('Failed org event delete');
        console.log(res);
      });
    };

    //Loads the events database list into the eventList scope variable
    $scope.loadEventList = function () {
      $http({
        method: 'GET',
        url: '/api/events'
      }).then(function (res) {
        console.log('Successful');
        console.log(res);
        $scope.eventList = res.data;


      }, function (res) {
        console.log('Failed');
        console.log(res);
      });
    };

    //Initially loading the events
    $scope.loadEventList();

    //Checks if the event was made by the user
    $scope.filterByUser = function (event) {
      return event.user.displayName === $scope.authentication.user.displayName;
    };

    //Checks if the user's name is in the organizationsPending list of an event
    $scope.filterOrgEvents = function (event) {
      return event.organizationsPending.indexOf($scope.authentication.user.displayName) !== -1;
    };

    //Allows a business to create an event
    $scope.createEvent = function () {
      console.log($scope.name);
      //console.log($scope.date);
      //console.log($scope.sTime);

      $http({
        method: 'POST',
        url: '/api/events',
        data: {
          name: $scope.name,
          dateOfEvent: $scope.date,
          startTime: $scope.sTime,
          endTime: $scope.eTime,
          location: $scope.location,
          taxIdRequired: $scope.requireTax
        }
      }).then(function (res) {
        console.log('Successful event');
      }, function (res) {
        console.log('Failed event');
        console.log(res);
        console.log(name);
        //console.log(date);
        //console.log(sTime);
      });

      /*$scope.name = null;
       $scope.date = null;
       $scope.sTime = null;
       $scope.eTime = null;
       $scope.location = null;
       $scope.requireTax = null;*/
    };

    //Toggles the acceptEvent flag
    $scope.toggleAcceptFlag = function () {
      $scope.acceptEvent_flag = !$scope.acceptEvent_flag;
      console.log('toggled accept flag');
    };

    //Sets some global event variable to a variable
    $scope.setGlobalEvent = function (event) {
      console.log('setting event');
      $scope.globalEvent = event;
    };

    $scope.refreshHandler = function () {
      console.log('refresh');
      if ($scope.authentication.user.roles.indexOf('Organization') >= 0) {
        $state.go('orgDash.eventList');
      }
    };

    $scope.getCalEvents = function () {
      var events = [];
      $http({
        method: 'GET',
        url: '/api/events'
      }).then(function (res) {
        console.log('Successful');
        console.log(res);
        $scope.eventList = res.data;

        for (var i = 0; i < res.data.length; i++) {
          var temp = {};

          // Extract the date from the dateOfEvent object
          var dateEvent = new Date(res.data[i].dateOfEvent);
          var timeEvent = new Date(res.data[i].startTime);
          var month = dateEvent.getMonth();
          var year = dateEvent.getFullYear();
          var date = dateEvent.getDate();
          var hours = timeEvent.getHours();

          // Used for debugging
          console.log('Month: ' + month);
          console.log('Year: ' + year);
          console.log('Date: ' + date);
          console.log('Time: ' + hours);

          temp.title = res.data[i].name;

          // Format the date
          temp.start = new Date(year, month, date, hours);

          // Check to see if the user logged in is the same one who made the event
          if ($scope.authentication.user.roles.indexOf('Organization') >= 0) {
            events.push(temp);
          }

          else {
            if (res.data[i].user.displayName === $scope.authentication.user.displayName) {
              events.push(temp);
            }
          }
        }

      }, function (res) {
        console.log('Failed');
        console.log(res);
      });

      return events;

    };

    $scope.eventSources = [$scope.events, $scope.getCalEvents()];

  }
]);
