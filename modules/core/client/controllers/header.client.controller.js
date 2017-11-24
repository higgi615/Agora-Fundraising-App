'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$state', 'Authentication', 'Menus',
  function ($scope, $state, Authentication, Menus) {
    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    // Get the topbar menu
    $scope.menu = Menus.getMenu('topbar');

    // Toggle the menu items
    $scope.isCollapsed = false;
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };

// FIX THIS FUNCTION!!
    $scope.logoRedirect = function (signedIn) {
      if (!signedIn){
        $state.go('home');
      }
      else {
        if ($scope.authentication.user.roles.indexOf('Organization') >= 0) {
          $state.go('orgDash.eventList');
          console.log($state.current);
        }
        else if ($scope.authentication.user.roles.indexOf('Business') >= 0) {
          $state.go('bizDash.eventList');
          console.log($state.current);
        }
      }
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);
