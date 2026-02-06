const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  const user = users.filter((user) => user.username === username);
  if(user.length > 0){
    return true;
  } else {
    return false;
  }

}

const authenticatedUser = (username,password)=>{ 
  const user = users.filter((user)=>user.username === username && user.password ===password);
  if(user)return true;
  else return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
   const {username , password} = req.body;
   if(!username||!password)return res.status(404).json({msg : "Invalid  Credentials"});
   if(!authenticatedUser(username))return res.status(404).json({msg:"User not present"});
   jwt.assign({
    username :username
   } , 'secret',
   {
    expiresIn : '1h'
   }
  );
  return res.status(200).json({
    message : 'Login Successful'
  })


  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
   const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.username;
  
  if (!review) {
    return res.status(400).json({
      message: "Review cannot be empty"
    });
  }

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  // Initialize reviews object if not present
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  // Add or update review
  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: books[isbn].reviews
  
}
  )});
  regd_users.delete("/auth/review/:isbn", (req, res) => {
     const isbn = req.params.isbn;
  const username = req.session.username;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({
      message: "Review by this user does not exist"
    });
  }

  // Proper deletion
  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully"
  });
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
