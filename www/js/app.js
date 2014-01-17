'use strict';

var app = angular.module('xdiApp', ['xdiApp.config', 'xdiApp.services', 'xdiApp.controllers', 'xdiApp.directives',
    'xdiApp.filters', 'google-maps', 'ionic', 'ionic.ui.content', 'ionic.ui.list', 'ionic.service.loading', 'ngTouch', 'ngRoute',
    'ngAnimate', 'firebase']);

// Initialize all the application dependencies (config, services, controllers, etc.)

// AppConfig Module Initialization
// Note: The application configuration module can be found in js\config.js.
var appConfig = angular.module('xdiApp.config', []);

// Services Module Initialization
// Note: Individual services can be found in js\services.
var appServices = angular.module('xdiApp.services', []);

// Controllers Module Initialization */
// Note: Individual controllers can be found in js\controllers.
var appControllers = angular.module('xdiApp.controllers', []);

// Directives Module Initialization
// Note: Individual directives can be found in js\directives.
var appDirectives = angular.module('xdiApp.directives', []);

// Filters Module Initialization
// Note: Individual filters can be found in js\filters.
var appFilters = angular.module('xdiApp.filters', []);

app.config(function ($compileProvider) {
    // Needed for routing to work
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
});

app.config(['$routeProvider', function ($routeProvider) {

    // Login
    $routeProvider.when('/login', {
        templateUrl: 'partials/account/login.html',
        controller: 'LoginCtrl'
    });

    $routeProvider.when('/profile', {
        authRequired: true,
        templateUrl: 'partials/account/profile.html',
        controller: 'AccountCtrl'
    });

    $routeProvider.when('/register', {
        authRequired: false,
        templateUrl: 'partials/account/register.html',
        controller: 'LoginCtrl'
    });

    // Login
    $routeProvider.when('/map', {
        authRequired: true,
        templateUrl: 'partials/home/map.html',
        controller: 'MapCtrl'
    });

    // if none of the above routes are met, use this fallback
    // which executes the 'AppCtrl' controller (AccountCtrl.js)
    $routeProvider.otherwise({
        redirectTo: '/login'
    });
}]);

function errMsg(err) {
    return err ? '[' + err.code + '] ' + err.toString() : null;
}

// establish authentication
app.run(['angularFireAuth', 'FBURL', '$rootScope', function (angularFireAuth, FBURL, $rootScope) {
    angularFireAuth.initialize(FBURL, {scope: $rootScope, name: "auth", path: '/login'});
    $rootScope.FBURL = FBURL;
}]);