const router = require('express').Router();
import {User} from '../models/User';
import {UserController} from '../controllers/UsersController';
import express, { Express, NextFunction, Request, Response } from 'express';

const validateUserId = async (req: Request, res: Response, next:NextFunction) => {
  const user = await User.findByPk(req.params.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  next();
}

router.get('/users', UserController.index);

router.post('/users', UserController.create);

router.get('/users/:userId', validateUserId, UserController.show);

router.put('/users/:userId', validateUserId, UserController.update);

router.delete('/users/:userId', validateUserId, UserController.delete);

router.get('/email/:email', UserController.enviarEmail );

export default router;
