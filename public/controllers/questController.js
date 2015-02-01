var app = angular.module('todoList', []);

app.controller('questController', ['$scope', '$http', function($scope, $http){

    $scope.init = function(){
        $.getJSON("/user/", function(result){
            $("#user-name").text(result['name']);
            $("#disp-pic").attr("src",result['imageUrl']);
            $("#pts").text(result['points']);
        });

        $.getJSON("/user/lists/", function(result){
            $scope.quests = result;
        });
    }

    $scope.init();

    $scope.subscribeList = function(){
        var stuff = prompt("Enter the ID of the list to subscribe:");
        if (stuff != null) {
            $http.post('/masterlists/subscribe',  { 'id' : stuff });
            location.reload();
        }
    }

}]);