/*global app*/

app.directive('passwordValidate', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModelCtrl) {
            function passwordValidate(value) {
                var valid = (value === scope[attrs.passwordValidate]);
                ngModelCtrl.$setValidity('equal', valid);
                return valid ? value : undefined;
            }
            ngModelCtrl.$parsers.push(passwordValidate);
            ngModelCtrl.$formatters.push(passwordValidate);
            
            scope.$watch(attrs.passwordValidate, function () {
                passwordValidate(element[0].value);
            });
        },
    };
});