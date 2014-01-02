(function () {
    'use strict';

    /* Services */

    angular.module('xdiApp.services', [])

        .factory('loginService', ['angularFireAuth', 'registerService', '$location', '$rootScope',
            function (angularFireAuth, registerService, $location, $rootScope) {
                return {
                    /**
                     * @param {string} email
                     * @param {string} pass
                     * @param {string} [redirect]
                     * @param {Function} [callback]
                     * @returns {*}
                     */
                    login: function (email, pass, redirect, callback) {
                        var p = angularFireAuth.login('password', {
                            email: email,
                            password: pass,
                            rememberMe: true
                        });

                        p.then(function (user) {
                            if (redirect) {
                                $location.path(redirect);
                            }
                            callback && callback(null, user);
                        }, callback);
                    },

                    /**
                     * @param {string} [redirectPath]
                     */
                    logout: function (redirectPath) {
                        angularFireAuth.logout();
                        if (redirectPath) {
                            $location.path(redirectPath);
                        }
                    },

                    changePassword: function (opts) {
                        if (!opts.oldpass || !opts.newpass) {
                            opts.callback('Please enter a password');
                        }
                        else if (opts.newpass !== opts.confirm) {
                            opts.callback('Passwords do not match');
                        }
                        else {
                            angularFireAuth._authClient.changePassword(opts.email, opts.oldpass, opts.newpass, function (err) {
                                opts.callback(errMsg(err));
                                $rootScope.$apply();
                            })
                        }
                    },

                    createAccount: function (email, pass, callback) {
                        angularFireAuth._authClient.createUser(email, pass, function (err, user) {
                            if (callback) {
                                callback(err, user);
                                $rootScope.$apply();
                            }
                        });
                    },

                    createProfile: registerService
                }
            }])

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
        }])

        // phonegap ready service - listens to deviceready
        .factory('phonegapReady', function () {
            return function (fn) {
                var queue = [];
                var impl = function () {
                    queue.push(Array.prototype.slice.call(arguments));
                };

                document.addEventListener('deviceready', function () {
                    queue.forEach(function (args) {
                        fn.apply(this, args);
                    });
                    impl = fn;
                }, false);

                return function () {
                    return impl.apply(this, arguments);
                };
            };
        })

        .factory('geolocation', function ($rootScope, phonegapReady) {
            return {
                getCurrentPosition: function (onSuccess, onError, options) {
                    navigator.geolocation.getCurrentPosition(function () {
                            var that = this,
                                args = arguments;

                            if (onSuccess) {
                                $rootScope.$apply(function () {
                                    onSuccess.apply(that, args);
                                });
                            }
                        }, function () {
                            var that = this,
                                args = arguments;

                            if (onError) {
                                $rootScope.$apply(function () {
                                    onError.apply(that, args);
                                });
                            }
                        },
                        options);
                }
            };
        });

    function errMsg(err) {
        return err ? '[' + err.code + '] ' + err.toString() : null;
    }
})();

