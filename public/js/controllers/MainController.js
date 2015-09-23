/*global app*/
app.controller('MainController', ['$scope', function ($scope) {
    $scope.dialogueBoxActive = false;
    
    $scope.closeBox = function () {
        $scope.$emit('hideDialogueBox');
    };
}]);