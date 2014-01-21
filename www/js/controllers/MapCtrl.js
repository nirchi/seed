'use strict';

appControllers

    .controller('MapCtrl', function ($scope) {

        function initialize() {

            if ("geolocation" in navigator) {
                /* geolocation is available */
                var wpid = navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
            } else {
                /* geolocation IS NOT available */
                $scope.error = "Geolocation is not available";
            }

            // Initialize the map.
            $scope.map = {
                center: {
                    latitude: 0,
                    longitude: 0
                },
                zoom: 10,
                marker: {
                    coords: {
                        latitude: 0,
                        longitude: 0
                    }
                }
            };

            // Initialize the current location marker.
            $scope.currentLocationMarker = {
                coords: {
                    latitude: 0,
                    longitude: 0
                }
            };

            function geo_success(position) {
                $scope.latitude  = position.coords.latitude;
                $scope.longitude = position.coords.longitude;

                $scope.map.center = {latitude: $scope.latitude, longitude: $scope.longitude};
                $scope.currentLocationMarker = {
                    coords: {
                        latitude: $scope.latitude,
                        longitude: $scope.longitude},
                    options: {
                        animation: google.maps.Animation.DROP
                    }
                };
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

    });