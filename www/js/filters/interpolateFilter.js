'strict'

appFilters

.filter('interpolateFilter', ['version', function (version) {
    return function (text) {
        return String(text).replace(/%VERSION%/mg, version);
    }
}]);