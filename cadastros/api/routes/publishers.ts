const router = require('express').Router();
import {Publisher} from '../models/Publisher';
import {PublisherController} from '../controllers/PublisherController';
import express, { Express, NextFunction, Request, Response } from 'express';

const validatePublishingId = async (req: Request, res: Response, next: NextFunction) => {
  const publishing = await Publisher.findByPk(req.params.publisherId);
  if (!publishing) {
    return res.status(404).json({ error: 'Publishing not found' });
  }
  next();
}

router.get('/publishers', PublisherController.index);

router.post('/publishers', PublisherController.create);

router.get('/publishers/:publisherId', validatePublishingId, PublisherController.show);

router.put('/publishers/:publisherId', validatePublishingId, PublisherController.update);

router.delete('/publishers/:publisherId', validatePublishingId, PublisherController.delete);

export default router;
