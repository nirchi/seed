'use strict';

appControllers

.controller('AccountCtrl', ['$scope', 'loginService', 'userService', 'angularFire', 'FBURL', '$timeout', function($scope, loginService, userService, angularFire, FBURL, $timeout) {

    angularFire(FBURL+'/user/'+$scope.auth.id, $scope, 'user', {});

    $scope.logout = function() {
        var watchId = userService.getWatchId();
        navigator.geolocation.clearWatch(watchId);

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

}]);