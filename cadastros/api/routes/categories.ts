const router = require('express').Router();
import {Category} from '../models/Category';
import express, { Express, NextFunction, Request, Response } from 'express';
import {CategoryController} from '../controllers/CategoriesController';

const validateCategoriesId = async (req:Request , res: Response, next: NextFunction) => {
  const categories = await Category.findByPk(req.params.categoryId);
  if (!categories) {
    return res.status(404).json({ error: 'Category not found' });
  }
  next();
}

router.get('/categories', CategoryController.index);

router.post('/categories', CategoryController.create);

router.get('/categories/:categoryId', validateCategoriesId, CategoryController.show);

router.put('/categories/:categoryId', validateCategoriesId, CategoryController.update);

router.delete('/categories/:categoryId', validateCategoriesId, CategoryController.delete);

export default router;
