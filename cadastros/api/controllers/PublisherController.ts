import { Op } from 'sequelize';
import {Publisher} from '../models/Publisher';
import {City} from '../models/City';
import {Log} from '../models/logModel';
import express, { Express, NextFunction, Request, Response } from 'express';


export class PublisherController {

  static index = async (req:Request, res: Response) => {
    const params: any = req.query;
    const sort: any = params.sort || 'id';
    const order: any = params.order || 'ASC';
    const where: any = {};
    
    if (params.name) {
      where.name = {
        [Op.iLike]: `%${params.name}%`
      };
    }
  

  
    const publisher = await Publisher.findAll({
      include:[{
        model: City,
        required: false,
        attributes: ['name']
      }],
      where: where,
      order: [ [sort, order] ]
    });
    res.json(publisher);
  }

  static create = async (req:Request, res: Response) => {
    try {
      const data = await this._validateData(req.body, req.params.publisherId);
      const publisher = await Publisher.create(data);
      Log.create({
        description: 'Publisher created.',
      });
      res.json(publisher);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static show = async (req:Request, res: Response) => {
    const publisher = await Publisher.findByPk(req.params.publisherId);
    res.json(publisher);
  }

  static update = async (req:Request, res: Response) => {
    try {
      const id = req.params.publisherId;
      const data = await this._validateData(req.body, id);
      await Publisher.update(data, {
        where: {
          id: id
        }
      });
      Log.create({
        description: 'Publisher updated.',
      });
      res.json(await Publisher.findByPk(id));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static delete = async (req:Request, res: Response) => {
    await Publisher.destroy({
      where: {
        id: req.params.publisherId
      }
    });
    Log.create({
      description: 'Publisher delete.',
    });
    res.json({});
  }

  static _validateData = async (data: any, id: any) => {
    const attributes : any= ['name', 'CityId'];
    const publishers : any= {};
    for (const attribute of attributes) {
      if (! data[attribute]){
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      publishers[attribute] = data[attribute];
    }

    if (await this._checkIfNameExists(publishers.name, id)) {
      throw new Error(`The publisher with name "${publishers.name}" already exists.`);
    }
    return publishers;
  }

  static  _checkIfNameExists = async (name: string, id: Number) => {
    const where : any = {
      name: name
    };

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await Publisher.count({
      where: where
    });

    return count > 0;
  }

}

