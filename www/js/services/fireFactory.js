'use strict';

appServices

.factory('fireFactory', ['FBURL',
    function fireFactory(FBURL) {
        return {
            firebaseRef: function(path) {
                path = (path !== '') ?  FBURL + '/' + path : FBURL;
                return new Firebase(path);
            }
        };
    }
]);