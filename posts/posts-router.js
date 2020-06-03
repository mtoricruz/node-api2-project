// 1 create file / import express
const express = require('express');

// 7 import db file
const Db = require('../data/db');

// 2 express.Router and assign to router const
const router = express.Router();

// 4 router.HTTPrequest (change server to router if copy/pasting from other file)
// ================== 4a. GET REQUESTS ====================
router.get('/', (req, res) => {
    const query = req.query
    Db.find(query)
        .then(posts => {
            res.status(200).json({ posts, query })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Error retrieving the posts',
            });
        });
});

router.get('/:id', (req, res) => {
    Db.findById(req.params.id)
        .then(post => {
            if (post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
})

router.get('/:id/comments', (req, res) => {
    const postId = req.params.id
    Db.findPostComments(postId)
        .then(post => {
            if (post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
})
// ================== 4b. POST REQUESTS ====================
router.post('/', (req, res) => {
        const newPost = req.body
        if(!newPost.title || !newPost.contents){
            console.log(newPost)
            res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
        } else {
            try {
                Db.insert(newPost)
                res.status(201).json(newPost)
            }
            catch (err) {
                res.status(500).json({ error: "There was an error while saving the post to the database" })
            }
        }
        
})

router.post('/:id/comments', (req, res) => {
    const postId = Number(req.params.id)
    const newComment = req.body
    // console.log(newComment)
    if(!newComment.text) {
        console.log(newComment)
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } else {
        Db.findById(postId)
            .then(post => {
                if (post.length === 0) {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                } else {
                    Db.insertComment(newComment)
                        .then(comment => res.status(201).json(comment))
                        .catch(err => {
                            console.log(err)
                            res.status(500).json({ error: "There was an error while saving the comment to the database" })
                        })
                }
            })
            .catch(err => console.log(err))
    }
})

// ===================== 4c. PUT ================================
// 1. I want to find the post by id that i want to edit
// 2. then if the postId doesn't match the .then post.id, return 404
// 3. then if the postId matches but it doesn't have the title or contents then return 400 error
// 4. else try {res 200 } / catch {500 err}
router.put('/:id', (req, res) => {
    const postId = Number(req.params.id)
    const editPost = req.body
    Db.findById(postId) 
        .then(post => {
            if (post.id !== postId) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })
            } else if(!editPost.title || !editPost.contents){
                res.status(400).json({ errorMessage: "Please provide title and contents for the post." });
            } else {
                try {
                    Db.update(postId, editPost)
                    res.status(200).json(editPost)
                }
                catch (err) {
                    console.log(err)
                }
            }
        })
        .catch(err => console.log(err),
            res.status(500).json()
        )
})

// ======================= 4d. DELETE ==============================

router.delete('/:id', (req, res) => {
    const postId = req.params.id
    
    Db.remove(postId)
    .then(post => {
        if (post.id !== postId) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
                res.status(200).json({ message: "it works" })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ error: "The post could not be removed" })
        })
})




// 3 export router
module.exports = router;