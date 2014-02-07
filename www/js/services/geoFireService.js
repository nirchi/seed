'use strict';

appServices

    .factory('geoFireService', ['fireFactory',
    function(fireFactory) {
//        var currentUser = null;
        var firebaseRef = fireFactory.firebaseRef('');
        var geo = new geoFire(firebaseRef);

        return {
            insertByLocWithId: function(id, latlng) {
//                var geo = new geoFire(firebaseRef);

                var latlngjson = {
                    latitude: latlng[0],
                    longitude: latlng[1]
                };

                geo.insertByLocWithId(latlng, id, latlngjson);
            },

            onPointsNearLoc: function(radius, latlng, callback) {
                geo.onPointsNearLoc(latlng, radius, callback);
            }
        };
    }]);