const express = require('express');
let books = require("./booksdb.js");
const axios = require('axios');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

/* ================= REGISTER ================= */

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some(user => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

/* ================= ROUTES ================= */

// Get all books
public_users.get('/', (req, res) => {
  res.status(200).json(books);
});

// Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const id = Number(req.params.isbn);
  const book = books[id];

  if (book) return res.status(200).json(book);
  return res.status(404).json({ message: "book not found!!" });
});

// Get books by author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  const result = [];

  for (const key in books) {
    if (books[key].author.toLowerCase() === author) {
      result.push(books[key]);
    }
  }

  if (result.length === 0) {
    return res.status(404).json({ message: "Book not found" });
  }

  return res.status(200).json(result);
});

// Get book by title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;

  for (const key in books) {
    if (books[key].title === title) {
      return res.status(200).json(books[key]);
    }
  }

  return res.status(404).json({ message: "book not found" });
});

// Get reviews
public_users.get('/review/:isbn', (req, res) => {
  const id = req.params.isbn;

  if (books[id]) {
    return res.status(200).json(books[id].reviews);
  }

  return res.status(404).json({ message: "book not found" });
});


async function getAllBooks() {
  const response = await axios.get('http://localhost:5000/');
  return response.data;
}


async function getBooksByISBN(isbn) {
  const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
  return response.data;
}

async function getBooksByAuthor(author) {
  const response = await axios.get(`http://localhost:5000/author/${author}`);
  return response.data;
}

// Task 13
async function getBookByTitle(title) {
  const response = await axios.get(`http://localhost:5000/title/${title}`);
  return response.data;
}

module.exports.general = public_users;
