'use strict';

angular.module('users').controller('ChangeProfilePictureController', ['$scope', '$timeout', '$window', 'Authentication', 'FileUploader',
  function ($scope, $timeout, $window, Authentication, FileUploader) {
    $scope.user = Authentication.user;
    $scope.imageURL = $scope.user.profileImageURL;
    $scope.eventURL = $scope.user.eventImageURL;
    // Create file uploader instance
    $scope.uploader = new FileUploader({
      url: 'api/users/picture',
      alias: 'newProfilePicture'
    });
    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });
   $scope.uploader2 = new FileUploader({
      url: 'api/users/eventBanner',
      alias: 'newEventPicture'
    });
    // Set file uploader image filter
    $scope.uploader2.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });
    // Called after the user selected a new picture file
    $scope.uploader.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.imageURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };
    $scope.uploader2.onAfterAddingFile = function (fileItem) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem._file);

        fileReader.onload = function (fileReaderEvent) {
          $timeout(function () {
            $scope.eventURL = fileReaderEvent.target.result;
          }, 0);
        };
      }
    };
    // Called after the user has successfully uploaded a new picture
    $scope.uploader.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
       $scope.cancelUploadProf();
  
    };
    $scope.uploader2.onSuccessItem = function (fileItem, response, status, headers) {
      // Show success message
      $scope.success2 = true;

      // Populate user object
      $scope.user = Authentication.user = response;

      // Clear upload buttons
      
       $scope.cancelUploadEvent();
    };
    // Called after the user has failed to uploaded a new picture
    $scope.uploader.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      $scope.cancelUploadProf();
      //$scope.cancelUploadEvent();
      // Show error message
      $scope.error = response.message;
    };
    $scope.uploader2.onErrorItem = function (fileItem, response, status, headers) {
      // Clear upload buttons
      //$scope.cancelUploadProf();
      $scope.cancelUploadEvent();
      // Show error message
      $scope.error2 = response.message;
    };

    // Change user profile picture
    $scope.uploadProfilePicture = function () {
      // Clear messages
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader.uploadAll();
    };

    $scope.uploadEventPicture = function () {
      // Clear messages
      $scope.success2 = $scope.error2 = null;

      // Start upload
      $scope.uploader2.uploadAll();
    };

    // Cancel the upload process
    $scope.cancelUploadProf = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
    $scope.cancelUploadEvent = function () {
      $scope.uploader.clearQueue();
      $scope.eventURL = $scope.user.eventImageURL;
    };
  }
]);
