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
// ================== 4b. POST REQUESTS ====================




// 3 export router
module.exports = router;