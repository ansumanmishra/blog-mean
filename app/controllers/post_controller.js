blog.controller('postCtrl', ['$scope', '$http', 'postService', function($scope, $http, postService) {
	postService.getAllPosts().success(function(result) {
		$scope.posts = result;
	});
}]);

blog.controller('postDetailCtrl', ['$scope', '$http', '$stateParams', '$location', 'postService', function($scope, $http, $stateParams, $location, postService) {
	
	// get post details
	postService.getPostDetail()
		.success(function(post) {
			$scope.post = post;
		})
		.error(function(err) {
			console.log(err);
	});
	
	//get comments for a post
	postService.getComments().success(function(comments) {
		$scope.comments = comments;
	}).error(function(err) {
		console.error(err);
	});
	
	// delete post
	$scope.deletePost = function() {
		postService.deletePost().success(function(result) {
			$location.path('/');
		}).error(function(err) {
			console.error(err);
		});
	};
	
	//Adding comment
	$scope.addComment = function() {

		postService.addComment($scope.comment).success(function(result) {
			$scope.comment = '';
			$scope.comments = result;
		}).error(function(err) {
			console.error(err);
		});
	};
	
	// delete comment
	$scope.deleteComment = function(postId, commentId) {
		
		postService.deleteComment(postId, commentId).success(function(result) {
			$scope.comments = result;
		}).error(function(err) {
			console.error(err);
		});
	};
}]);

blog.controller('postCreateCtrl', ['$scope', '$http', '$location', '$stateParams', 'Upload', function($scope, $http, $location, $stateParams, Upload) {
	
	var postId = $stateParams.id;
	
	if(postId) {
		$scope.pageTitle = 'Edit Post';
		
		$http.get('http://localhost:3000/api/post/'+postId)
			.success(function(post) {
				$scope.post = post;
				$scope.post.photo = 'uploads/'+post.photo;
			})
			.error(function(err) {
				console.log(err);
		});
	}
	else {
		$scope.pageTitle = 'Create Post';
	}
	$scope.pageTitle = $stateParams.id ? 'Edit Post' : 'Create Post';
		
	$scope.createPost = function() {
			
		Upload.upload({
			url: '/api/post/create',
			method: 'POST',
			data: $scope.post
		}).then(function (resp) {
			$location.path('/');	
		}, function (resp) {
			// display error in console
			console.log(resp);
		});			
	};
}]);