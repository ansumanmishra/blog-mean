var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');

// Include the controllers
var postController = require('./server/controllers/post_controller');

mongoose.connect('mongodb://localhost:27017/blog', function(err) {
	if(!err) {
		console.log('Database connection successful');
	}
});

var app = express();
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/uploads', express.static(__dirname+'/uploads'));
app.use('/app', express.static(__dirname+'/app'));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/app/index.html');
});

app.get('/api/post/getAllPosts', postController.getAllPosts);
app.post('/api/post/create', postController.addEditPosts);
app.delete('/api/post/:id', postController.deletePost);
app.get('/api/post/:id', postController.getPostDetail);

//Getting comments for a post
app.get('/api/post/:id/comments', postController.getComments);

// Adding comment for a post
app.post('/api/post/:postId/comment/add', postController.addComment);

// Deleting comment for a post
app.delete('/api/post/:postId/:commentId', postController.deleteComment);

app.listen(3000, function() {
	console.log('Server is listening in port 3000');
});