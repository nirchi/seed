'use strict';

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array or 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('xdiApp', ['ionic.ui.content', 'ionic.ui.list', 'ionic.service.loading', 'AngularGM', 'xdiApp.config', 'ionic', 'ngTouch', 'ngRoute', 'ngAnimate', 'xdiApp.services', 'xdiApp.controllers', 'firebase'])

    .config(function ($compileProvider) {
        // Needed for routing to work
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
    })

    .config(['$routeProvider', function($routeProvider) {

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
        // which executes the 'AppCtrl' controller (controllers.js)
        $routeProvider.otherwise({
            redirectTo: '/login'
        });

    }])

    // double-check that the app has been configured
    /*.run(['FBURL', function (FBURL) {
        if (FBURL === 'https://xdi.firebaseio.com') {
            angular.element(document.body).html('<h1>Please configure app/js/config.js before running!</h1>');
        }
    }])
    */

    // establish authentication
    .run(['angularFireAuth', 'FBURL', '$rootScope', function (angularFireAuth, FBURL, $rootScope) {
        angularFireAuth.initialize(FBURL, {scope: $rootScope, name: "auth", path: '/login'});
        $rootScope.FBURL = FBURL;
    }]);

