const express = require('express');


const server = express();

// middleware
server.use(express.json());

// 5 import router 
const postsRouter = require('./posts/posts-router');

// 6 server.use(endpoint, router)
server.use('/api/posts', postsRouter)


server.listen(9000, () => {
    console.log('\n*** Server Running on http://localhost:9000 ***\n');
  });