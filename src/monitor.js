const Arena = require('bull-arena');
const express = require('express');
const router = express.Router();

const arena = Arena({
  queues: [
    {
        "name": "inspect",
        "hostId": "inspect",
        "host": "localhost",
        "port": 6379
    }
  ]
});

router.use('/', arena);
