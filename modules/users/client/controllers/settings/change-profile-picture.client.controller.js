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
 $scope.uploader2 = new FileUploader({
      url: 'api/users/picture',
      alias: 'newEventPicture'
    });
    // Set file uploader image filter
    $scope.uploader.filters.push({
      name: 'imageFilter',
      fn: function (item, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
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
    $scope.uploader2.onAfterAddingFileEvent = function (fileItem2) {
      if ($window.FileReader) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL(fileItem2._file);

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
    $scope.uploader2.onSuccessItem2 = function (fileItem2, response, status, headers) {
      // Show success message
      $scope.success = true;

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
    $scope.uploader2.onErrorItem2 = function (fileItem2, response, status, headers) {
      // Clear upload buttons
      //$scope.cancelUploadProf();
      $scope.cancelUploadEvent();
      // Show error message
      $scope.error = response.message;
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
      $scope.success = $scope.error = null;

      // Start upload
      $scope.uploader2.uploadItem();
    };

    // Cancel the upload process
    $scope.cancelUploadProf = function () {
      $scope.uploader.clearQueue();
      $scope.imageURL = $scope.user.profileImageURL;
    };
    $scope.cancelUploadEvent = function () {
      $scope.uploader2.clearQueue();
      $scope.eventURL = $scope.user.eventImageURL;
    };
  }
]);
