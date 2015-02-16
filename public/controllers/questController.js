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
        if (key != null){
            $http.post('/masterlists/subscribe',  { 'id' : key }).success(function(){
                location.reload();
            }).error(function(){
                $("#diag-warning").text("Something weird happened. Please try again.");
            })
            
        }
        else {
            $("#diag-warning").text("You didn't enter anything!");
        }
    }

    $scope.createQuest = function(){
        var title = $scope.quest_title;
        var tasks = $scope.quest_tasks;
        if (title == null && tasks == null) {
            $("#diag-quest-warning").text("You didn't enter anything!");
        }
        else if (title == null) {
            $("#diag-quest-warning").text("You didn't enter a title!");
        }
        else if (tasks == null) {
            $("#diag-quest-warning").text("You didn't enter any tasks!");
        }
        else {
            tasks = tasks.split("\n");
            $http.post('/masterlists/new', {'title' : title, 'tasks' : tasks.join()}).success(function(){
                $.getJSON("/masterlists/all", function(result){
                    for (var i=0; i < result.length; i++) {
                        if (result[i]['title'] == title) {
                            $http.post('/masterlists/subscribe',  { 'id' : result[i]['_id'] }).success(function(){
                                location.reload();
                            }).error(function(){
                                $("#diag-quest-warning").text("Something weird happened. Please try again.");
                            })
                        }
                    }
                }).error(function(){
                    $("#diag-quest-warning").text("Something weird happened. Please try again.");
                })
            }).error(function(){
                $("#diag-quest-warning").text("Something weird happened. Please try again.");
            })
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