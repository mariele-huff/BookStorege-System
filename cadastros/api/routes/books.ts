const router = require('express').Router();
import {Book} from '../models/Book';
import {BookController} from '../controllers/BookController';
import express, { Express, NextFunction, Request, Response } from 'express';

const validadeBookId = async (req:Request, res:Response, next:NextFunction) => {
  const books = await Book.findByPk(req.params.bookId);
  if (!books) {
    return res.status(404).json({ error: 'Book not found' });
  }
  next();
}

router.get('/books', BookController.index);

router.post('/books', BookController.create);

router.get('/books/:bookId', validadeBookId, BookController.show);

router.put('/books/:bookId', validadeBookId, BookController.update);

router.delete('/books/:bookId', validadeBookId, BookController.delete);
export default router;
