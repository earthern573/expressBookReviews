const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Task 7
const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  const userMatches = users.filter((user) => user.username === username);
  return userMatches.length > 0; // If the username exists, return true, else false
}

// Task 7
const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const matchingUsers = users.filter((user) => user.username === username && user.password === password);
  return matchingUsers.length > 0; // If there's a match, return true, else false
}

// Task 7 - only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  // Validate the user credentials
  if (!authenticatedUser(username, password)) {
    return res.status(208).json({ message: "Invalid username or password" });
  }
  // If valid, create an access token using JWT
  let accessToken = jwt.sign({ data: username }, "access", { expiresIn: 3600 });
  // Save the access token in the session
  req.session.authorization = { accessToken, username };
  // Send a success message
  return res.status(200).send("User successfully logged in");
});

// Task 8 - Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.query.review;  // Use query to get the review
  const username = req.session.authorization.username;  // Retrieve the username from session
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }
  if (books[isbn]) {
    let book = books[isbn];
    // If a review from the same user already exists, modify it; otherwise, add a new one
    book.reviews[username] = review;
    return res.status(200).send("Review successfully posted or updated");
  } else {
    return res.status(404).json({ message: `ISBN ${isbn} not found` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
