import { Op } from 'sequelize';
import {Log} from '../models/logModel';
import {Category} from '../models/Category';
import express, { Express, NextFunction, Request, Response } from 'express';


 export class CategoryController {

  
  static index = async (req: Request, res: Response) => {
    const params: any = req.query;
    const sort: any = params.sort || 'id';
    const order: any = params.order || 'ASC';
    const where: any = {};

    if (params.description) {
      where.description = {
        [Op.iLike]: `%${params.description}%`
      };
    }

    const category = await Category.findAll({
      where: where,
      order: [ [sort, order] ]
    });
    res.json(category);
  }

  static create = async (req: Request, res: Response) => {
    try {
      const data = await this._validateData(req.body,req.params.categoryId );
      const category = await Category.create(data);
      Log.create({
        description: 'Category create.',
      });
      res.json(category);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static show = async (req: Request, res: Response) => {
    const category = await Category.findByPk(req.params.categoryId);
    res.json(category);
  }

  static update = async (req: Request, res: Response) => {
    try {
      const id : any = req.params.categoryId;
      const data = await this._validateData(req.body, id);
      await Category.update(data, {
        where: {
          id: id
        }
      });
      Log.create({
        description: 'Category updated.',
      });
      res.json(await Category.findByPk(id));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static delete = async (req: Request, res: Response) => {
    await Category.destroy({
      where: {
        id: req.params.categoryId
      }
    });
    Log.create({
      description: 'Category Delete.',
    });
    res.json({});
  }

  static _validateData = async (data: any, id: any) => {
    const attributes : any = ['description'];
    const categories: any = {};
    for (const attribute of attributes) {
      if (!data[attribute]) {
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      categories[attribute] = data[attribute];
    }

    if (await this._checkIfDescriptionExists(categories.description, id)) {
      throw new Error(`The category with name "${categories.description}" already exists.`);
    }

    return categories;
  }

  static  _checkIfDescriptionExists = async (description: string, id: Number) => {
    const where : any= {
      description: description
    };

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await Category.count({
      where: where
    });

    return count > 0;
  }

}


