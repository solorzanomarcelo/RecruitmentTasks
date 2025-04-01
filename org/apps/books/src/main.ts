/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import Book from './models/book';

const app = express();
app.use(express.json()); // Enables JSON body parsing

let bookData: Map<string, Book> = new Map();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to books!' });
});

function getBooks(): Book[] {
  return Array.from( bookData.values() );
}

function createBook(title: string, author: string, year: number): void {
  // TODO: Check if title&author&year already exist to avoid creation of duplicate
  
  const bookId = uuidv4();
  const book = new Book(bookId, title, author, year);
  bookData.set(bookId, book);
}

function updateBook(bookId: string, newTitle?: string, newAuthor?: string, newYear?: number): boolean {
  // TODO: Check if title&author&year already exist to avoid creation of duplicate

  if (!newTitle && !newAuthor && !newYear) {
    return false;
  }
  else if (!bookData.has(bookId)) {
    return false;
  }
  else {
    const current = bookData.get(bookId);
    const newBook = new Book(bookId, 
      newTitle ? newTitle : current!.getTitle(), 
      newAuthor ? newAuthor : current!.getAuthor(), 
      newYear ? newYear : current!.getYear());
    bookData.set(bookId, newBook);

    return true;
  }
}

function deleteBook(bookId: string): boolean {
  if (!bookData.has(bookId)) {
    return false;
  }
  else {
    bookData.delete(bookId);

    return true;
  }
}

// CREATE
const validateTitleChain = () => body('title').notEmpty().isString();
const validateAuthorChain = () => body('author').notEmpty().isString();
const validateYearChain = () => body('year').notEmpty().isInt();

const validateBookIdChain = () => param('id').notEmpty().isUUID();

// GET
app.get('/books', function (req, res) {
  const results = JSON.stringify(getBooks());
  res.send({ books: results });
});

// POST
app.post('/books', validateTitleChain(), validateAuthorChain(), validateYearChain(), function (req, res) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const { title, author, year } = req.body;
    createBook(title, author, year);
    res.send({ message: 'Book successfuly created!' });
  }
  else {
    res.send({ message: `Book was not created: ${result.array().at(0)?.msg}` });
  }
});

// PUT
app.put('/books/:id', validateBookIdChain(), validateTitleChain().optional(), validateAuthorChain().optional(), validateYearChain().optional(), function (req, res) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const bookId = req.params!.id;
    const { title, author, year } = req.body;
    const result = updateBook(bookId, title, author, year);
    if (result) {
      res.send({ message: 'Book successfuly updated!' });
    }
    else {
      res.send({ message: 'Book was not updated!' });
    }
  }
  else {
    res.send({ message: `Book was not updated: ${result.array().at(0)?.msg}` });
  }
});

// DELETE
app.delete('/books/:id', validateBookIdChain(), function (req, res) {
  const result = validationResult(req);
  if (result.isEmpty()) {
    const bookId = req.params!.id;
    const result = deleteBook(bookId);
    if (result) {
      res.send({ message: 'Book successfuly deleted!' });
    }
    else {
      res.send({ message: 'Book was not found!' });
    }
  }
  else {
    res.send({ message: `Book was not deleted: ${result.array().at(0)?.msg}` });
  }
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
