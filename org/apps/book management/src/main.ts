/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import * as path from 'path';
import { Book } from './models/book';

const app = express();

let bookData: Map<string, Book> = new Map();
let globalIdentifier = 0;

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to book management!' });
});

app.get('/books', (req, res) => {
  const bookList = Array.from( bookData.values() );
  res.send({ books: bookList });
});

app.post('/books', (req, res) => {
  const { title, author, year } = req.body;
  const book = new Book(globalIdentifier, title, author, year);
  bookData.set(globalIdentifier.toString(), book);
  globalIdentifier++;
  
  res.send({ message: 'Book successfuly created!' });
});

app.put('/books/:id', (req, res) => {
  const bookId = req.params.id;
  const { title, author, year } = req.body;
  const book = new Book(bookId, title, author, year);
  bookData.set(bookId, book);
  
  res.send({ message: 'Book successfuly updated!' });
});

app.delete('/books/:id', (req, res) => {
  const userId = req.params.id;
  if (bookData.has(userId)) {
    bookData.delete(userId);
    res.send({ message: 'Book successfuly deleted!' });
  }
  else {
    res.send({ message: 'Book was not found!' });
  }
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
