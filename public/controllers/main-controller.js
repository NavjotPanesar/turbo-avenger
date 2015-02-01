var app = angular.module('todoList', [])

.controller('mainController', ['$scope', '$http', function($scope, $http){
	
	$scope.sendPost = function(){
		var stuff = $scope.words;
		console.log(stuff);
		$http.post('/masterlists/done',  { 'test' : stuff }).success(function(){
			console.log("success");
		}).error(function(){
			console.log("error");
		})
	}
	
	$scope.toggleTest = function(){
		$http.post('/users/toggle', { 
			'listId': '54cd53e4920fe934b56073a6',
			'description': 'do stuff'
		}).success(function(){
			console.log("toggleTest success");
		}).error(function(){
			console.log("toggleTest error");
		});
			
	}
}]);