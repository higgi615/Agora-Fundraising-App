// 'use strict';
//
// angular.module('users').controller('DeleteProfileController', ['$scope', '$http', '$state', '$location', 'Users', 'Authentication',
//   function ($scope, $http, $state, $location, Users, Authentication) {
//     $scope.user = Authentication.user;
//
//     // Update a user profile
//     $scope.deleteUserProfile = function (isValid) {
//       $scope.success = $scope.error = null;
//
//       if (!isValid) {
//         $scope.$broadcast('show-errors-check-validity', 'userForm');
//
//         return false;
//       }
//
//       var user = new Users($scope.user);
//
//       user.$delete(function (response) {
//         $scope.$broadcast('show-errors-reset', 'userForm');
//
//         $scope.success = true;
//         response = undefined;
//         Authentication.user = response;
//
//        // Navigate back to the home state after successful delete and sign out
//         $state.go($state.previous.state.name || 'home', $state.previous.params);
//
//         }, function (response) {
//         $scope.error = response.data.message;
//       });
//     };
//   }
// ]);
