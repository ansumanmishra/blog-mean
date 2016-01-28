var blog = angular.module('blog', ['ui.router', 'ngFileUpload']);

blog.config(function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');
	
	$stateProvider
		.state('home', {
			url: '/',
			templateUrl: '/app/partials/posts.html'
		})
		.state('createPost', {
			url: '/post/create',
			templateUrl: '/app/partials/create_post.html',
			controller: 'postCreateCtrl'
		})
		.state('editPost', {
			url: '/post/:id/edit',
			templateUrl: '/app/partials/create_post.html',
			controller: 'postCreateCtrl'
		})
		.state('postDetail', {
			url: '/post/:id',
			templateUrl: '/app/partials/post_detail.html',
			controller: 'postDetailCtrl'
		});
		
	$urlRouterProvider.otherwise('/');
});
