'use strict';

appServices

    .service('geoCoderService', function () {

        this.getGeo = function (params, callback) {

            var geocoder = new google.maps.Geocoder();

            geocoder.geocode(params, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK && results[0]) {
                    return callback({
                        address: results[0].formatted_address, latlng: [results[0].geometry.location.lat(), results[0].geometry.location.lng()]
                    });

                } else {
                    return callback(false);
                }
            });
        }
    });