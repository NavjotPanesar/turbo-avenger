var app = angular.module('todoList', []);

app.controller('questController', ['$scope', '$http', function($scope, $http){

    $http.get('/user/leaderboard').success(function(data){
        console.log(data);
        $scope.leaderboard = data;      
    })
    
    function getUserLists(callback){
        $.getJSON("/user/lists/", function(result){
            $scope.quests = result;
            typeof callback === 'function' && callback();
        });
    }

    $scope.init = function(){
        $.getJSON("/user/", function(result){
            $("#user-name").text(result['name']);
            $("#disp-pic").attr("src",result['imageUrl']);
            $("#pts").text(result['points']);
        });
        
        getUserLists();
    }

    $scope.init();

    $scope.subscribeList = function(){
        var key = $scope.subscr_key;
        console.log(key);
        if (key != null){
            $http.post('/masterlists/subscribe',  { 'id' : key });
            location.reload();
        }
    }

    $scope.toggle = function(desc, listId){
        console.log(listId);
        console.log(desc)
        $http.post('/user/toggle', { 
            'listId': listId,
            'description': desc
        }).success(function(){
            getUserLists(function(){
                $scope.$digest();
            });
        }).error(function(){
             getUserLists(function(){
                $scope.$digest();
            });
        });
            
    }

}]);