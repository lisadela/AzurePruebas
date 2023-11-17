const express = require('express');
const app = express();
const https = require('https')
const fs = require('fs')
const httpsOptions = {
    key: fs.readFileSync('./security/key.pem'),
    cert: fs.readFileSync('./security/cert.pem')
}

app.set('view engine', 'ejs');
var access_token = "";

// Import the axios library, to make HTTP requests
const axios = require('axios')
// This is the client ID and client secret that you obtained
// while registering on github app
const clientID = '764f336bf522359d74c7'
const clientSecret = 'de57e03aa5640478cee72668110be54e7eaceb9d'

const port = process.env.PORT || 2400;

// Declare the callback route
app.get('/github/callback', (req, res) => {

  // The req.query object has the query params that were sent to this route.
  const requestToken = req.query.code
  
  axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
    // Set the content type header, so that we get the response in JSON
    headers: {
         accept: 'application/json'
    }
  }).then((response) => {
    access_token = response.data.access_token
    res.redirect('/success');
  })
})

app.get('/success', function(req, res) {

  axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      Authorization: 'token ' + access_token
    }
  }).then((response) => {
    res.render('pages/success',{ userData: response.data });
  })
});

app.get('/', function(req, res) {
  res.render('pages/index',{client_id: clientID});
});


app.listen(port,() => {

        console.log(```server running at ${port} desde la consola```);
    });