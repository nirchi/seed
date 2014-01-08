'use strict';

appControllers

    .controller('MapCtrl', ['$scope', 'angularFire', 'FBURL', '$timeout', function($scope, angularFire, FBURL, $timeout) {

    // Wait for device API libraries to load
    //
    document.addEventListener("deviceready", onDeviceReady, false);

    // device APIs are available
    //
    function onDeviceReady() {
        navigator.geolocation.watchPosition(onSuccess, onError);
    }

    navigator.geolocation.watchPosition(onSuccess, onError);

    $scope.icons = {
        gray: 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_gray.png',
        red: 'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_red.png'
    };

    $scope.options = {
        map: {
            center: $scope.center,
            zoom: 14,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        },
        highlighted: {
            icon: $scope.icons.red
        },
        unhighlighted: {
            icon: $scope.icons.gray
        }
    };

    $scope.filters = {
        name: null,
        male: true,
        female: true
    };

    // onSuccess Geolocation
    //
    function onSuccess(position) {
        $scope.center = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

        $scope.people.push({"id":1, "name":"You Are Here","gender":"male","location":{"lat":position.coords.latitude,"lng":position.coords.longitude}});
    }

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
            'message: ' + error.message + '\n');
    }

//        $scope.getMarkerOptions = function(person) {
//            var opts = {title: person.name};
//            if (person.id in $scope.filteredPeople) {
//                return angular.extend(opts, $scope.options.highlighted);
//            } else {
//                return angular.extend(opts, $scope.options.unhighlighted);
//            }
//        };
//
//        $scope.filterPeople = function() {
//            $scope.filteredPeople = {};
//            angular.forEach($scope.people, function(person) {
//                var nameMatch = ($scope.filters.name) ? ~person.name.indexOf($scope.filters.name) : true;
//                var isMale = person.gender === 'male';
//                var genderMatch = ($scope.filters.male && isMale) ||
//                    ($scope.filters.female && !isMale);
//                if (nameMatch && genderMatch) {
//                    $scope.filteredPeople[person.id] = person;
//                }
//            });
//            $scope.$broadcast('gmMarkersRedraw', 'people');
//        };
//
//        $scope.$watch('people', function() {
//            $scope.filterPeople();
//        });

    $scope.people = [{"id":2,"name":"Gianna Hodges","gender":"female","location":{"lat":4,"lng":21}},{"id":3,"name":"Isabella Davidson","gender":"female","location":{"lat":21,"lng":-11}},{"id":4,"name":"Aubrey Mercer","gender":"female","location":{"lat":-13,"lng":-22}}, {"id":5,"name":"Tim Lepple","gender":"male","location":{"lat":10,"lng":21}}];

}]);