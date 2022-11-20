import { Op } from 'sequelize';
import {Format} from '../models/format';
import {Log} from '../models/logModel';
import express, { Express, NextFunction, Request, Response } from 'express';

export class FormatController {

  static index = async (req:Request, res:Response) => {
    const params: any= req.query;
    const sort: any = params.sort || 'id';
    const order: any = params.order || 'ASC';
    const where: any = {};


    if (params.description) {
      where.description = {
        [Op.iLike]: `%${params.description}%`
      };
    }
  


    const formats = await Format.findAll({
      where: where,
      order: [ [sort, order] ]
    });
    res.json(formats);
  }

  static create = async (req: Request, res:Response) => {
    try {
      const data = await this._validateData(req.body, req.params.formatId);
      const format = await Format.create(data);
      Log.create({
        description: 'Format created.',
      });
      res.json(format);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static show = async (req: Request, res:Response) => {
    const format = await Format.findByPk(req.params.formatId);
    res.json(format);
  }

  static update = async (req: Request, res:Response) => {
    try {
      const id = req.params.formatId;
      const data = await this._validateData(req.body, id);
      await Format.update(data, {
        where: {
          id: id
        }
      });
      Log.create({
        description: 'Format updated.',
      });
      res.json(await Format.findByPk(id));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static delete = async (req: Request, res:Response) => {
    await Format.destroy({
      where: {
        id: req.params.formatId
      }
    });
    Log.create({
      description: 'Format delete.',
    });
    res.json({});
  }

  static  _validateData = async (data: any, id: any) => {
    const attributes: any  = ['description'];
    const format : any= {};
    for (const attribute of attributes) {
      if (!data[attribute]) {
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      format[attribute]  = data[attribute];
    }

    if (await this._checkIfDescriptionExists(format.description, id)) {
      throw new Error(`The format with description "${format.province}" already exists.`);
    }

    return format;
  }

  static  _checkIfDescriptionExists = async (description: string, id: Number) => {
    const where : any= {
      description: description
    };

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await Format.count({
      where: where
    });

    return count > 0;
  }

}


