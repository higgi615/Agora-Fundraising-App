(function () {
  'use strict';

  // Events controller
  angular
    .module('events')
    .controller('EventsController', EventsController);

  EventsController.$inject = ['$scope', '$timeout', '$state', '$window', 'Authentication', 'FileUploader', 'eventResolve'];

  function EventsController ($scope, $timeout, $state, $window, Authentication, FileUploader, event) {
    var vm = this;

    vm.authentication = Authentication;
    vm.event = event;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    vm.upsuccess = null;
    vm.uperror = null;

    vm.imageURL = event.banner;

    // Create file uploader instance
    vm.uploader = new FileUploader({
      url: 'api/events/picture',
      alias: 'newEventBanner'
    });

    // Set file uploader image filter
    vm.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });

    // Called after the event selected a new picture file
    vm.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            vm.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    }

    // Called after the event has successfully uploaded a new picture
    vm.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      vm.upsuccess = true;

      // Populate event object
      vm.event = Authentication.event = response;

      // Clear upload buttons
      vm.cancelUpload();
    }

    // Called after the event has failed to uploaded a new picture
    vm.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      vm.cancelUpload();

      // Show error message
      vm.uperror = response.message;
    }

    // Change event profile picture
    function uploadEventPicture() {
      // Clear messages
      vm.upsuccess = vm.uperror = null;

      // Start upload
      vm.uploader.uploadAll();
    }

    // Cancel the upload process
    function cancelUpload() {
      vm.uploader.clearQueue();
      vm.imageURL = vm.event.banner;
    }

    // Remove existing Event
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.event.$remove($state.go('bizDash.eventList'));
      }
    }

    // Save Event
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.eventForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.event._id) {
        vm.event.$update(successCallback, errorCallback);
      } else {
        vm.event.$save(successCallback, errorCallback);
      }

      // On success creation of an event, route back to the event list page
      function successCallback(res) {
        $state.go('bizDash.eventList', {
          eventId: res._id
        });
      }

      // if there is an error, send the message !!
      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

