// Initialize Firebase
var firebase = require('firebase');

var config = {
  apiKey: "AIzaSyBI4Jb71gkU1LsQYCTRu7gw769Nb7-wQoo",
  authDomain: "a3default.firebaseapp.com",
  databaseURL: "https://a3default.firebaseio.com",
  projectId: "a3default",
  storageBucket: "",
  messagingSenderId: "877503307659"
};
firebase.initializeApp(config);

//get elements
//const preObject = document.getElementById('object');

//create references
const dbRefObject = firebase.database().ref().child('object');

//sync object changes
//console.log("abc");
dbRefObject.on('value', snap => console.log(snap.val()));
// ======================  ======================

var express = require('express');
var bodyParser = require('body-parser')
var path = require('path');
const cookieParser = require('cookie-parser');
var app = express();

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dfpktpjp8', 
  api_key: '628676291839431', 
  api_secret: 'dZjwflkh9gZdNisiK_MWzhr8y4s' 
});

// cloudinary.v2.uploader.upload("../images/back.png", function(error, result) {
//   console.log(error);
//   console.log(result); 
// });

function myLogger(req, res, next) {
  // console.log("Raw Cookies: ",req.headers.cookie)
  // console.log("Cookie Parser: ",req.cookies)
  // console.log("Signed Cookies: ",req.signedCookies)
  if (req.body) {
    console.log('LOG:',req.method,req.url,req.body)
  }
   res.append('Set-Cookie', 'lastPage='+req.url);
  next()
}

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser("Pets!"));
app.use(myLogger)


// ====================== handling api/posts, R/W into DB ======================
app.get('/api/posts', function(req, res) {
  // Client requests posts

  res.send('Get request received!\n');
});

app.get('/api/posts/:id', function(req, res) {
  // Client requests a certain post
  var post_id = req.params.id;

  res.send('Get request for post: ' + post_id + ' received!\n');
});

app.post('/api/posts', function(req, res) {
  // Client submits a post
  var title = req.body.title; 
  var username = req.body.username;
  var content = req.body.content; 
  var file = req.body.file;

  writeNewPost(title, username, content, file);

  res.send('Post request received!\n');
});

app.put('/api/posts/:id', function(req, res) {
  // Client attempts to update a post
  var post_id = req.params.id;

  var title = req.body.title; 
  var username = req.body.username;
  var content = req.body.content; 
  var file = req.body.file; 

  console.log(post_id);
  res.send('Update request received!\n');
});

app.delete('/api/posts/:id', function(req, res) {
  // Client attempts to delete a post,
  // NEED to check if this post belong to this user
  var post_id = req.params.id;
  var username = req.body.username;

  console.log(post_id);
  res.send('Delete request received!\n');
});

function writeNewPost(title, username, content, picture) {
  // A post entry.
  var postData = {
    title: title,
    author: username,
    content: content,
    picture: picture
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('posts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/posts/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}
// ====================== handling api/accounts, R/W into DB ======================

app.get('/api/accounts/:id', function(req, res) {
  // Client requests a certain post
  var post_id = req.params.id;

  res.send('Get request for account: ' + post_id + ' received!\n');
});

app.post('/api/accounts', function(req, res) {
  // Client create an account
  var firstName = req.body.title; 
  var username = req.body.username;
  var email = req.body.email;
  var address = req.body.address;
  var username = req.body.username;
  var pw = req.body.pw;
  writeNewPost(title, username, content, file);

  res.send('Post request received!\n');
});

app.put('/api/account/:id', function(req, res) {
  // Client attempts to update a post
  var account_id = req.params.id;

  var firstName = req.body.title; 
  var username = req.body.username;
  var email = req.body.email;
  var address = req.body.address;
  var pw = req.body.pw;

  console.log(post_id);
  res.send('Update request received!\n');
});


function createNewAccount(firstName, lastName, email, address, username, pw) {
  // A post entry.
  var postData = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    address: address,
    username: username,
    password: pw
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('accounts').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates['/accounts/' + newPostKey] = postData;

  return firebase.database().ref().update(updates);
}

//=============================== Web page ===============================
app.get('/', function(req, res) {
    res.cookie('securecookie', 51, {maxAge: 100000, secure: true});
    res.cookie('name', 'Tom', { signed: true });
    res.sendFile(path.join(__dirname + '/../index.html'));
});

app.get('/css/pet_forum.css', function(req, res) {
    res.sendFile(path.join(__dirname + '/../css/pet_forum.css'));
});

app.get('/js/script.js', function(req, res) {
    res.sendFile(path.join(__dirname + '/../js/script.js'));
});

//=============================== Files ===============================
app.get('/images/:img', function(req, res) {
  res.sendFile(path.join(__dirname + '/../images/' + req.params.img));
});

app.get('/lib/:file', function(req, res) {
  res.sendFile(path.join(__dirname + '/../lib/' + req.params.file));
});

app.get('/favicon.ico', function(req, res) {
  res.sendFile(path.join(__dirname + '/../images/favicon.ico'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});