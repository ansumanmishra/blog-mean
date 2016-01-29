var fs  = require('fs');
var express = require('express');
var mongoose = require('mongoose');
var multiparty = require('multiparty');
var Post = require('../../server/models/postModel');
var Comment = require('../../server/models/commentModel');

/* Common image upload function */
function _uploadPostPhoto(files, callback) {
	if(files.photo === undefined) {
		callback('');
	}
	else {
		var img = files.photo[0],
			imgName = Date.now()+img.originalFilename;
			
		fs.readFile(img.path, function(err, data) {
			var uploadPath = './uploads/' + imgName;
			
			fs.writeFile(uploadPath, data, function(err) {
				if(err) {
					console.log(err);
					return false;
				}
				else {
					console.log('Image name from the private function : ' + imgName);
					callback(imgName);
				}
			});	
		});
	}
}
/* Common image upload function */

// Getting all posts
module.exports.getAllPosts = function(req, res) {
	Post.find({}).exec(function(err, posts) {
		res.json(posts);
	});
};

// Adding/Editing post
module.exports.addEditPosts = function(req, res) {
	var form = new multiparty.Form();
	
	form.parse(req, function(err, fields, files) {
		var title = fields.title,
			body = fields.body,
			author = fields.author;
		
		if(fields._id) {
		// Edit post
			Post.findById(fields._id).exec(function(err, post) {
				if(err) {
					res.status(500).render('500');
				}
				else if(!post) {
					res.status(404).render('404');
				}
				else {
					// Check if there is an existing image uploaded previously - If it's there and not updated then
					// keep that image or replace the new image with the updated one.
					
					if(files.photo === undefined) {
						post.photo = post.photo;
					}
					else {

						// If there is a photo for the post then delete photo
						fs.readFile('./uploads/' + post.photo, function(err) {
							if(!err) {
								fs.unlinkSync('./uploads/' + post.photo);
							}
						});
						
						var img = files.photo[0],
						imgName = Date.now()+img.originalFilename;
						
						fs.readFile(img.path, function(err, data) {
							var uploadPath = './uploads/' + imgName;
							
							fs.writeFile(uploadPath, data, function(err) {
								if(err) {
									console.log(err);
									res.json({message: 'There is some problem uploading the image to the server!'});
								}
								else {
									console.log('Upload successful');									
								}
							});	
						});
						post.photo = imgName;
					}
					
					post.title = fields.title;
					post.author = fields.author;
					post.body = fields.body;
					
					post.save(function(err) {
						if(err) {
							res.json({status: 500});
						}
						else {
							res.json({status: 200});
						}
					});
				}
			});
		}
		else {
			// Do form validations here. If form validation is successful then execute the following piece of code.
			_uploadPostPhoto(files, function(imgName) {
				Post.create({
					title: fields.title,
					body: fields.body,
					author: fields.author,
					photo: imgName
				});
				res.json({status: 200});
			});
		}
	});	
};

// Deleting a post
module.exports.deletePost = function(req, res) {
	var id = req.params.id;
	
	Post.findByIdAndRemove(id, function(err, post) {
		if(err) {
			res.status(500).render('500');
		}
		else {
			// Delete the comments for this post as well
			Comment.remove({post_id: post._id}, function(err) {
				if(!err) {
					res.json({status: 200, message: 'Post and comments are deleted successfully'});
				}
			});
			
			// If there is a photo for the post then delete photo
			fs.readFile('./uploads/' + post.photo, function(err) {
				if(!err) {
					fs.unlinkSync('./uploads/' + post.photo);
				}
			});
		}
	});
};

// Getting a detail of a post
module.exports.getPostDetail = function(req, res) {
	Post.findById(req.params.id).exec(function(err, post) {
		if(err) {
			console.log(err);
			res.json({status: 500});
		}
		else {
			res.json(post);
		}
	});
};

// Getting comments for a post
module.exports.getComments = function(req, res) {
	var postId = req.params.id;
	
	Comment.find({post_id: postId}).exec(function(err, comments) {
		if(err) {
			res.json({status: 500});
		}
		else {
			res.json(comments);
		}
	});
};

// Adding comments for a post
module.exports.addComment = function(req, res) {
	
	var newComment = new Comment({
		 comment_author: req.body.comment_author,
		 comment_desc: req.body.comment_desc,
		 post_id: req.params.postId
	});
	
	newComment.save(function(err, results) {
		if(err) {
			res.json({status: 500});
		}
		else {
			Comment.find({post_id: req.params.postId}).exec(function(err, comments) {
				res.json(comments);
			});
		}
	});
};

// deleting comment for a post
module.exports.deleteComment = function(req, res) {
	var postId = req.params.postId;
	var commentId = req.params.commentId;
	
	Comment.findByIdAndRemove(commentId, function(err, comments) {
		if(err) {
			res.json({status: 500});
		}
		else {
			Comment.find({post_id: req.params.postId}).exec(function(err, comments) {
				res.json(comments);
			});
		}
	});
};
