angular.module('app', [
  'app.directives',
  'app.services',
  'app.create',
  'app.edit',
  'app.dashboard',
  'app.auth',
  'ngRoute',
  'ngSanitize',
  'gridshore.c3js.chart',
  'satellizer'
])

.config(['$routeProvider', '$httpProvider', '$authProvider',
  function ($routeProvider, $httpProvider, $authProvider) {
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
      .when('/edit', {
        templateUrl: 'app/edit/edit.html',
        controller: 'EditController',
        authenticate: true
      })
      .otherwise({
        redirectTo: '/dashboard'
      });

    $authProvider.loginUrl = '/signin';
    $authProvider.signupUrl = '/signup';

    $authProvider.google({
      clientId: '416143587162-phs72qq27pfvqua6buqb5lf4okum9krq.apps.googleusercontent.com',
      url: '/authenticate/google'
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
