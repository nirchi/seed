'use strict';

angular.module('xdiApp.controllers', [])

    .controller('LoginCtrl', ['$scope', 'loginService', function ($scope, loginService) {
        $scope.email = null;
        $scope.username = null;
        $scope.pass = null;
        $scope.confirm = null;
        $scope.createMode = false;

        $scope.login = function (callback) {
            $scope.err = null;
            loginService.login($scope.email, $scope.pass, '/profile', function (err, user) {
                $scope.err = err || null;
                typeof(callback) === 'function' && callback(err, user);
            });
        };

        $scope.createAccount = function () {
            if (!$scope.email) {
                $scope.err = 'Please enter an email address';
            }
            else if (!$scope.username) {
                $scope.err = 'Please enter a username';
            }
            else if (!$scope.pass) {
                $scope.err = 'Please enter a password';
            }
            else if ($scope.pass !== $scope.confirm) {
                $scope.err = 'Passwords do not match';
            }
            else {
                loginService.createAccount($scope.email, $scope.pass, function (err, user) {
                    if (err) {
                        $scope.err = err;
                    }
                    else {
                        // must be logged in before I can write to my profile
                        $scope.login(function (err) {
                            if (!err) {
                                loginService.createProfile(user.id, user.email, $scope.username);
                            }
                        });
                    }
                });
            }
        };
    }])

    .controller('AccountCtrl', ['$scope', 'loginService', 'angularFire', 'FBURL', '$timeout', function($scope, loginService, angularFire, FBURL, $timeout) {

        angularFire(FBURL+'/user/'+$scope.auth.id, $scope, 'user', {});

        $scope.logout = function() {
            loginService.logout('/login');
        };

        $scope.oldpass = null;
        $scope.newpass = null;
        $scope.confirm = null;

        function reset() {
            $scope.err = null;
            $scope.msg = null;
        }

        $scope.updatePassword = function() {
            reset();
            loginService.changePassword(buildPwdParms());
        };

        $scope.$watch('oldpass', reset);
        $scope.$watch('newpass', reset);
        $scope.$watch('confirm', reset);

        function buildPwdParms() {
            return {
                email: $scope.auth.email,
                oldpass: $scope.oldpass,
                newpass: $scope.newpass,
                confirm: $scope.confirm,
                callback: function(err) {
                    if( err ) {
                        $scope.err = err;
                    }
                    else {
                        $scope.msg = 'Password updated!';
                    }
                }
            }
        }

    }]);
