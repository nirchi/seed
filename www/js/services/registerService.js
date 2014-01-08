'use strict';

appServices

    .factory('registerService', ['Firebase', 'FBURL', '$rootScope', function (Firebase, FBURL, $rootScope) {
        return function (id, email, username, callback) {
            new Firebase(FBURL).child('users/' + id).set({email: email, username: username}, function (err) {
                //err && console.error(err);
                if (callback) {
                    callback(err);
                    $rootScope.$apply();
                }
            });

            function firstPartOfEmail(email) {
                return ucfirst(email.substr(0, email.indexOf('@')) || '');
            }

            function ucfirst(str) {
                // http://kevin.vanzonneveld.net
                // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
                // +   bugfixed by: Onno Marsman
                // +   improved by: Brett Zamir (http://brett-zamir.me)
                // *     example 1: ucfirst('kevin van zonneveld');
                // *     returns 1: 'Kevin van zonneveld'
                str += '';
                var f = str.charAt(0).toUpperCase();
                return f + str.substr(1);
            }
        }
    }]);