const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');


//post model
const Post = require('../../models/Post');
//profile model
const Profile = require('../../models/profile');
//vaidation
const validatePostInput = require('../../validation/post');


//@route GET api/posts/test
//@desc Tests posts route
//@access public
router.get('/test', (req, res) => res.json({ msg: "Posts Works" }));

//@route POST api/posts
//@desc Get all posts
//@access public
router.get('/', (req, res) => {

    Post.find()
        .sort({ date: -1 })
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({ nopostsfound: 'no posts found' }));
});

//@route POST api/posts/:id
//@desc Get post by id
//@access public
router.get('/:id', (req, res) => {

    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({ nopostfound: 'no post found for the id' }));
});

//@route DELETE api/posts/:id
//@desc Delete post
//@access private
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

    Profile.findOne({ user: req.user.id })
        .then(Profile => {
            Post.findById(req.params.id)
                .then(Post => {
                    //check for Post owner
                    if (Post.user.toString() !== req.user.id) {
                        return res.status(401).json({ notAuthorized: 'User not authorized' });
                    }
                    //delete
                    Post.remove().then(() => res.json({ success: 'true' }));
                })
                .catch(err => res.status(404).json({ PostNotFound: 'Post not found for the id' }));
        });


});

//@route POST api/posts/like/:id
//@desc like post
//@access private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

    Profile.findOne({ user: req.user.id })
        .then(Profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(likes => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({ alreadyLiked: 'user already liked this post' });
                    }

                    //add user ID to likes array
                    post.likes.unshift({ user: req.user.id });
                    post.save().then(post => res.json(post));
                    ;


                })
                .catch(err => res.status(404).json({ PostNotFound: 'Post not found for the id' }));
        });


});


//@route POST api/posts/unlike/:id
//@desc unlike post
//@access private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {

    Profile.findOne({ user: req.user.id })
        .then(Profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                        return res.status(400)
                            .json({ notYetLiked: 'you have not yet liked this post' });
                    }

                    //remove user ID to likes array
                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id);

                    //Splice out of array
                    post.likes.splice(removeIndex, 1);
                    post.save().then(post => res.json(post));


                })
                .catch(err => res.status(404).json({ PostNotFound: 'Post not found for the id' }));
        });

});







router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

    const { errors, isValid } = validatePostInput(req.body);
    //Check validation

    if (!isValid) {

        //if any errors, send 400 with errors
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));
});

module.exports = router;