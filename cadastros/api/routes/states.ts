const router = require('express').Router();
import {State} from '../models/State';
import {StateController} from '../controllers/StateController';
import express, { Express, NextFunction, Request, Response } from 'express';
const validateEstadoUf = async (req: Request, res: Response, next: NextFunction) => {
  const estado = await State.findByPk(req.params.stateId);
  if (!estado) {
    return res.status(404).json({ error: 'State not found' });
  }
  next();
}

router.get('/states', StateController.index);

router.post('/states', StateController.create);

router.get('/states/:stateId', validateEstadoUf, StateController.show);

router.put('/states/:stateId',validateEstadoUf, StateController.update);

router.delete('/states/:stateId',validateEstadoUf, StateController.delete);

export default router;

