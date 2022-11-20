const router = require('express').Router();
import {City} from '../models/City';
import {CityController} from '../controllers/CityController';
import express, { Express, NextFunction, Request, Response } from 'express';

const validateCitiesId = async (req: Request, res: Response, next: NextFunction) => {
  const city = await City.findByPk(req.params.cityId);
  if (!city) {
    return res.status(404).json({ error: 'City not found' });
  }
  next();
}

router.get('/cities', CityController.index);

router.post('/cities', CityController.create);

router.get('/cities/:cityId', validateCitiesId, CityController.show);

router.put('/cities/:cityId', validateCitiesId, CityController.update);

router.delete('/cities/:cityId', validateCitiesId, CityController.delete);

export default  router;
