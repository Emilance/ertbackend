const express = require('express');
const NodeCache = require('node-cache');

const app = express();
const myCache = new NodeCache();

// Middleware to check the cache before processing a request
  const checkCache = (req, res, next) => {
  const key = req.originalUrl || req.url;
  const cachedData = myCache.get(key);

  if (cachedData) {
    // If data is found in cache, send it directly
    res.send(cachedData);
  } else {
    // If data is not found in cache, proceed with the request
    next();
  }
};


module.exports = {checkCache}