angular.module('app.create', [])

.controller('CreateController', ['$rootScope', '$scope', '$filter',
  function($rootScope, $scope, $filter) {
    $rootScope.showNav = true;

    $scope.addHabit = function() {
      console.log('Reminder = ', $scope.reminder, ' || Type = ', typeof($scope.reminder));
      console.log('Due = ', $scope.due, ' || Type = ', typeof($scope.due));
    };
  }
]);
