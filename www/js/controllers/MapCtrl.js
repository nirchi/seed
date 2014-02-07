'use strict';

appControllers

    .controller('MapCtrl', ['$scope', 'angularFireAuth', 'fireFactory', 'userService', function ($scope, angularFireAuth, fireFactory, userService) {

        function initialize() {

            if ("geolocation" in navigator) {
                /* geolocation is available */
                var id = navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
                userService.setWatchId(id);
            } else {
                /* geolocation IS NOT available */
                $scope.error = "Geolocation is not available";
            }

            $scope.map = {
                center: {
                    latitude: 0,
                    longitude: 0
                },
                zoom: 17,
                currentLocationMarker: {},
                userLocationMarkers: []
            };

//            $scope.map.userLocationMarkers.length = 0;

            function geo_success(position) {
                $scope.latitude  = position.coords.latitude;
                $scope.longitude = position.coords.longitude;
                $scope.latlng = [$scope.latitude, $scope.longitude];

                $scope.map.center = {latitude: $scope.latitude, longitude: $scope.longitude};
                $scope.map.currentLocationMarker = {
                    coords: {
                        latitude: $scope.latitude,
                        longitude: $scope.longitude
                    },
                    options: {
                        animation: google.maps.Animation.DROP
                    },
                    icon: 'icon/climbing.png'
                };

                userService.setUserLocation($scope.latlng);

                userService.getUsersNearLocation($scope.latlng, user_locations);

//                fireFactory.firebaseRef('users' + '/' + userService.getUser().id).child('latitude').set($scope.latitude);
//                fireFactory.firebaseRef('users' + '/' + userService.getUser().id).child('longitude').set($scope.longitude);
            }

            function user_locations(userLocations) {

                var userLocationRef = fireFactory.firebaseRef('geoFire/dataById');
//                var allUserLocations = [];
//                var userLocation;

                userLocationRef.once('value', function(dataSnapshot) {

                    var hasChildren = dataSnapshot.hasChildren();

                    dataSnapshot.forEach(function(childSnapshot) {
                        var id = childSnapshot.name();
                        var value = childSnapshot.val();

                        if (id != userService.getUser().id)
                        {
                            var userLocationMarker = {
                                latitude: value.latitude,
                                longitude: value.longitude,
                                title: id,
                                options: {
                                    animation: google.maps.Animation.DROP
                                },
                                icon: 'icon/windsurfing.png'
                            };

                            $scope.map.userLocationMarkers.push(userLocationMarker);
                        }
                    });
                });
            }

            function geo_error() {
                alert("Sorry, no position available.");
            }

            var geo_options = {
                enableHighAccuracy: true,
                maximumAge        : 30000,
                timeout           : 27000
            };
        }

        initialize();

//        $scope.currentLocationMarker = {
//            coords: {
//                latitude: 30,
//                longitude: 30
//            }
//        };
    }]);