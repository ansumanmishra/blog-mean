angular.module('blog').service('postService', ['$http', '$stateParams', function($http, $stateParams) {
	var baseAjaxUrl = 'http://localhost:3000/api/';
	
	this.getAllPosts = function() {
		return $http.get(baseAjaxUrl+'post/getAllPosts');
	};
	
	this.getPostDetail = function() {
		var id = $stateParams.id;
		return $http.get(baseAjaxUrl+'post/'+id);
	};
	
	this.getComments = function() {
		var id = $stateParams.id;
		return $http.get(baseAjaxUrl+'post/'+ id + '/comments');
	};
	
	this.deletePost = function() {
		var id = $stateParams.id;
		return $http.delete(baseAjaxUrl+'post/'+id);
	};
	
	this.addComment = function(comment) {
		return $http.post(baseAjaxUrl+'post/'+$stateParams.id+'/comment/add', comment);
	};
	
	this.deleteComment = function(postId, commentId) {
		return $http.delete(baseAjaxUrl+'post/'+postId+'/'+commentId);
	};
}]);