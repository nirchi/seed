'use strict';

appServices

    .factory('loginService', ['angularFireAuth', 'registerService', 'userService', '$location', '$rootScope',
        function (angularFireAuth, registerService, userService, $location, $rootScope) {
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
                        console.log('Logged In', $rootScope);
                        // Store the auth token
                        localStorage.setItem('token', user.firebaseAuthToken);

                        userService.setUser(user);

                        userService.getn

                        //$rootScope.isLoggedIn = true;

                        //$rootScope.userId = user.id;

                        // Set the userRef and add user child refs once
                        //$rootScope.userRef = fireFactory.firebaseRef('users').child(user.id);
//                        $rootScope.userRef.once('value', function(data) {
//                            // Set the userRef children if this is first login
//                            var val = data.val();
//                            var info = {
//                                userId: user.id,
//                                name: user.name
//                            };
//                            // Use snapshot value if not first login
//                            if (val) {
//                                info = val;
//                            }
//                            $rootScope.userRef.set(info); // set user child data once
//                        });

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
        }]);