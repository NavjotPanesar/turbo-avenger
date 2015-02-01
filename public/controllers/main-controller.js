var app = angular.module('todoList', []);


app.controller('mainController', ['$scope', '$http', function($scope, $http){
	
	$scope.subscribeUser = function(){
		var stuff = $scope.words;
		console.log(stuff);
		$http.post('/masterlists/subscribe',  { 'id' : stuff }).success(function(){
			console.log("success");
		}).error(function(){
			console.log("error");
		})
	}
	
	$scope.newMasterList = function(){
		var title = $scope.title;
		var tasks = $scope.tasks;
		$http.post('/masterlists/new', {'title' : title, 'tasks' : tasks}).success(function(){
			console.log("success");
		}).error(function(){
			console.log("error");
		})
	}
	
	$scope.toggleTest = function(){
		$http.post('/user/toggle', { 
			'listId': $scope.listId,
			'description': $scope.description
		}).success(function(){
			console.log("toggleTest success");
		}).error(function(){
			console.log("toggleTest error");
		});
			
	}
}]);