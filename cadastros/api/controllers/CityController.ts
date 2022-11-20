import { Op } from 'sequelize';
import {City} from '../models/City';
import {State} from '../models/State';
import {Log} from '../models/logModel';
import express, { Express, NextFunction, Request, Response } from 'express';

export class CityController {

  static index = async (req: Request, res: Response) => {
    const params: any= req.query;
    const sort: any = params.sort || 'id';
    const order: any = params.order || 'ASC';
    const where: any = {};

    if(params.StateId)
    {
      where.StateId = 
      {
        [Op.eq]: params.StateId
      }
    }

    if (params.name) {
      where.name = {
        [Op.iLike]: `%${params.name}%`
      };
    }

    if (params.cep) {
      where.cep = {
        [Op.iLike]: `%${params.cep}%`
      };
    }
   
  
    const  city = await City.findAll({
   where: where,
      include:[{
        model: State,
        required: false,
        attributes: ['name', 'province']
      }], 
     
      order: [ [sort, order] ]
    });
    res.json(city);
  }

  static create = async (req: Request, res: Response) => {
    try {
      const data: any = await this._validateData(req.body,req.params.cityId );
      const city = await City.create(data);
      Log.create({
        description: 'City created.',
      });
      res.json(city);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static show = async (req: Request, res: Response) => {
    const city = await City.findByPk(req.params.cityId);
    res.json(city);
  }

  static update = async (req: Request, res: Response) => {
    try {
      const id: any = req.params.cityId;
      const data = await this._validateData(req.body, id);
      await City.update(data, {
        where: {
          id: id
        }
      });
      Log.create({
        description: 'City updated.',
      });
      res.json(await City.findByPk(id));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static delete = async (req: Request, res: Response) => {
    await City.destroy({
      where: {
        id: req.params.cityId
      }
    });
    Log.create({
      description: 'City delete.',
    });
    res.json({});
  }

  static  _validateData = async (data: any, id: any) => {
    const attributes : any = ['name', 'StateId', 'cep'];
    const city : any= {};
    for (const attribute of attributes) {
      if (! data[attribute]){
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      city[attribute] = data[attribute];
    }

    if (await this._checkIfNameExists(city.name, id, city.StateId)) {
      throw new Error(`The city with this name "${city.name}" already exists.`);
    }
    
    if (await this._checkIfCepExists(city.cep, id)) {
      throw new Error(`The city with CEP "${city.cep}" already exists.`);
    }
    return city;
  }
  

  static _checkIfNameExists = async (name: string, id: Number, StateId: Number) => {
    const where : any = {
      name: name,
      StateId: StateId, 

    };

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await City.count({
      where: where
    });

    return count > 0;
  }

  static _checkIfCepExists = async (cep: string, id: Number) => {
  const where : any= {
    cep: cep

  };

  if (id) {
    where.id = { [Op.ne]: id }; // WHERE id != id
  }

  const count = await City.count({
    where: where
  });

  return count > 0;
}
}




