'use strict';

appDirectives

.directive('appVersionDirective', ['version', function (version) {
    return function (scope, elm, attrs) {
        elm.text(version);
    }
}]);