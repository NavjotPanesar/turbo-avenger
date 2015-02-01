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
}]);