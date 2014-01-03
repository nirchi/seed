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
            loginService.login($scope.email, $scope.pass, '/map', function (err, user) {
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

    }])

//    .controller('MapCtrl', ['$scope', 'angularFire', 'FBURL', '$timeout', function($scope, angularFire, FBURL, $timeout) {
//        function initialize() {
//            var mapOptions = {
//                center: new google.maps.LatLng(43.07493,-89.381388),
//                zoom: 16,
//                mapTypeId: google.maps.MapTypeId.ROADMAP
//            };
//            var map = new google.maps.Map(document.getElementById("map"),
//                mapOptions);
//
//            // Stop the side bar from dragging when mousedown/tapdown on the map
//            google.maps.event.addDomListener(document.getElementById('map'), 'mousedown', function(e) {
//                e.preventDefault();
//                return false;
//            });
//
//            $scope.map = map;
//        }
//        google.maps.event.addDomListener(window, 'load', initialize);
//
//        if(!$scope.map) {
//            return;
//        }
//
//        $scope.loading = Loading.show({
//            content: 'Getting current location...',
//            showBackdrop: false
//        });
//
//        navigator.geolocation.getCurrentPosition(function(pos) {
//            $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
//            $scope.loading.hide();
//        }, function(error) {
//            alert('Unable to get location: ' + error.message);
//        });
//
//    }]);

    .controller('MapCtrl', ['$scope', 'angularFire', 'FBURL', '$timeout', function($scope, angularFire, FBURL, $timeout) {

        // Wait for device API libraries to load
        //
        document.addEventListener("deviceready", onDeviceReady, false);

        // device APIs are available
        //
        function onDeviceReady() {
            navigator.geolocation.watchPosition(onSuccess, onError);
        }

        navigator.geolocation.watchPosition(onSuccess, onError);

        $scope.icons = {
            gray: 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_gray.png',
            red: 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_red.png'
        };

        $scope.options = {
            map: {
                center: $scope.center,
                zoom: 14,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            },
            highlighted: {
                icon: $scope.icons.red
            },
            unhighlighted: {
                icon: $scope.icons.gray
            }
        };

        $scope.filters = {
            name: null,
            male: true,
            female: true
        };

        // onSuccess Geolocation
        //
        function onSuccess(position) {
            $scope.center = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

            $scope.people.push({"id":1, "name":"You Are Here","gender":"male","location":{"lat":position.coords.latitude,"lng":position.coords.longitude}});
        }

        // onError Callback receives a PositionError object
        //
        function onError(error) {
            alert('code: '    + error.code    + '\n' +
                'message: ' + error.message + '\n');
        }

        $scope.getMarkerOptions = function(person) {
            var opts = {title: person.name};
            if (person.id in $scope.filteredPeople) {
                return angular.extend(opts, $scope.options.highlighted);
            } else {
                return angular.extend(opts, $scope.options.unhighlighted);
            }
        };

        $scope.filterPeople = function() {
            $scope.filteredPeople = {};
            angular.forEach($scope.people, function(person) {
                var nameMatch = ($scope.filters.name) ? ~person.name.indexOf($scope.filters.name) : true;
                var isMale = person.gender === 'male';
                var genderMatch = ($scope.filters.male && isMale) ||
                    ($scope.filters.female && !isMale);
                if (nameMatch && genderMatch) {
                    $scope.filteredPeople[person.id] = person;
                }
            });
            $scope.$broadcast('gmMarkersRedraw', 'people');
        };

        $scope.$watch('people', function() {
            $scope.filterPeople();
        });

        $scope.people = [{"id":2,"name":"Gianna Hodges","gender":"female","location":{"lat":4,"lng":21}},{"id":3,"name":"Isabella Davidson","gender":"female","location":{"lat":21,"lng":-11}},{"id":4,"name":"Aubrey Mercer","gender":"female","location":{"lat":-13,"lng":-22}}, {"id":5,"name":"Tim Lepple","gender":"male","location":{"lat":10,"lng":21}}];

}]);
