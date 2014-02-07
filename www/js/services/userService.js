'use strict';

appServices

    .factory('userService', ['geoFireService',
        function(geoFireService) {
            var currentUser;
            var nearbyUsers = null;
            var watchId;

            return {
                getUser: function() {
                    return currentUser;
                },
                setUser: function(user) {
                    currentUser = user;
                },
                setUserLocation: function(latlng) {
                    geoFireService.insertByLocWithId(currentUser.id, latlng);
                },
                getUsersNearLocation: function(latlng, callback) {
                    return geoFireService.onPointsNearLoc(5, latlng, callback);
                },
                setWatchId: function(id) {
                    watchId = id;
                },
                getWatchId: function() {
                    return watchId;
                }

            };
        }]);