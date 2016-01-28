blog.controller('postCtrl', ['$scope', '$http', function($scope, $http) {
	$http.get('http://localhost:3000/api/post/getAllPosts').success(function(result) {
		$scope.posts = result;
	});
}]);

blog.controller('postDetailCtrl', ['$scope', '$http', '$stateParams', '$location', function($scope, $http, $stateParams, $location) {
	var id = $stateParams.id;
	
	// get post details
	$http.get('http://localhost:3000/api/post/'+id)
		.success(function(post) {
			$scope.post = post;
		})
		.error(function(err) {
			console.log(err);
	});
	
	//get comments for a post
	$http.get('http://localhost:3000/api/post/'+ id + '/comments').success(function(comments) {
		$scope.comments = comments;
	}).error(function(err) {
		console.error(err)
	});
	
	// delete post
	$scope.deletePost = function() {
		$http.delete('http://localhost:3000/api/post/'+id).success(function(result) {
			$location.path('/');
		}).error(function(err) {
			console.error(err);
		});
	};
	
	//Adding comment
	$scope.addComment = function() {

		$http.post('http://localhost:3000/api/post/'+$stateParams.id+'/comment/add', $scope.comment).success(function(result) {
			$scope.comment = '';
			$scope.comments = result;
		}).error(function(err) {
			console.error(err);
		});
	};
	
	// delete comment
	$scope.deleteComment = function(postId, commentId) {
		
		$http.delete('http://localhost:3000/api/post/'+postId+'/'+commentId).success(function(result) {
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