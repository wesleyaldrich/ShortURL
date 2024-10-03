require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const dns = require('dns');
const { log } = require('console');
let listedUrl = [];

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

// bodyParsing middleware for form submission
app.use(express.urlencoded({extended: true}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  const long_url = req.body.url;
  const {hostname} = new URL(long_url);
  console.log(long_url);
  console.log(hostname);

  dns.lookup(hostname, (err) => {
    if (err){
      console.log(err);
      res.json({
        error: "invalid url"
      })
    }
    else {
      if (listedUrl.includes(long_url)){
        res.json({
          "original_url": long_url,
          "short_url": listedUrl.indexOf(long_url) + 1
        })
      }
      else {
        listedUrl.push(long_url);
        res.json({
          "original_url": long_url,
          "short_url": listedUrl.length
        })
      }
    }
  })
});

app.get('/api/shorturl/:short_url', (req, res) => {
  short_url = req.params.short_url;
  console.log(short_url);

  let isDigit = /^\d+$/.test(short_url);
  console.log(isDigit);
  if (!isDigit || short_url == 0){
    res.json({
      error: "Wrong format"
    })
  }
  else {
    short_url = parseInt(short_url);
    if (short_url < 0 || short_url > listedUrl.length){
      res.json({
        error: "No short URL found for the given input"
      })
    }
    else {
      res.redirect(listedUrl[short_url - 1]);
    }
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
