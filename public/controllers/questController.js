var app = angular.module('todoList', []);

app.controller('questController', ['$scope', '$http', function($scope, $http){

    $scope.init = function(){
        $.getJSON("/user/", function(result){
            console.log(result['name']);
            $("#user-name").text(result['name']);
            $("#disp-pic").attr("src",result['imageUrl']);
        });
    }

    $scope.init();

}]);