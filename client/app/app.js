angular.module('app', [
  'app.directives',
  'app.services',
  'app.create',
  'app.dashboard',
  'app.auth',
  'ngRoute',
  'gridshore.c3js.chart'
])

.config(['$routeProvider', '$httpProvider',
  function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/signin', {
        templateUrl: 'app/auth/signin.html',
        controller: 'AuthController',
      })
      .when('/signup', {
        templateUrl: 'app/auth/signup.html',
        controller: 'AuthController',
      })
      .when('/signout', {
        template: '',
        controller: 'AuthController',
      })
      .when('/dashboard', {
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'DashboardController',
        authenticate: true
      })
      .when('/create', {
        templateUrl: 'app/create/create.html',
        controller: 'CreateController',
        authenticate: true
      })
      .otherwise({
        redirectTo: '/dashboard'
      });

      $httpProvider.interceptors.push('AttachTokens');
  }
])

.factory('AttachTokens', ['$window',
  function ($window) {
    var attach = {
      request: function (object) {
        var jwt = $window.localStorage.getItem('com.habit');
        if (jwt) {
          object.headers.Authorization = 'Bearer ' + jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  }
])

.run(['$rootScope', '$location', 'Auth',
  function ($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
        $location.path('/signin');
      }
    });
  }
]);
