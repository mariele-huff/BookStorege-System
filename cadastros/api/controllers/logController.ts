import { Op } from 'sequelize';
import {Log} from '../models/logModel';
import express, { Express, NextFunction, Request, Response } from 'express';
export class LogsController {

  static create = async (req: Request, res: Response, data:any) => {
    try {
      const log = await Log.create(data);
      res.json(log);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}

