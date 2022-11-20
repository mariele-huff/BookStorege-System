const router = require('express').Router();
import {Format} from '../models/format';
import {FormatController} from '../controllers/formatController';
import express, { Express, NextFunction, Request, Response } from 'express';

const validateFormatId = async (req: Request, res: Response, next: NextFunction) => {
  const format = await Format.findByPk(req.params.formatId);
  if (!format) {
    return res.status(404).json({ error: 'Format not found' });
  }
  next();
}

router.get('/format', FormatController.index);

router.post('/format', FormatController.create);

router.get('/format/:formatId', validateFormatId, FormatController.show);

router.put('/format/:formatId',validateFormatId, FormatController.update);

router.delete('/format/:formatId',validateFormatId, FormatController.delete);
export default router;
