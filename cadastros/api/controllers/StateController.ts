import { Op } from 'sequelize';
import { State } from '../models/State';
import { Log } from '../models/logModel';
import express, { Express, NextFunction, Request, Response } from 'express';

export class StateController {

  static index = async (req: Request, res: Response) => {
    const params: any = req.query;
    const sort: any = params.sort || 'id';
    const order: any = params.order || 'ASC';
    const where: any = {};



    if (params.name) {
      where.name = {
        [Op.iLike]: `%${params.name}%`
      };
    }
    if (params.province) {
      where.province = {
        [Op.iLike]: `%${params.province}%`
      };
    }

    const states = await State.findAll({
      where: where,
      order: [[sort, order]]
    });
    res.json(states);
  }

  static create = async (req: Request, res: Response) => {
    try {
      const data = await this._validateData(req.body, req.params.stateId);
      const state = await State.create(data);
      Log.create({
        description: 'State created.',
      });
      res.json(state);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static show = async (req: Request, res: Response) => {
    const state = await State.findByPk(req.params.stateId);
    res.json(state);
  }

  static update = async (req: Request, res: Response) => {
    try {
      const id = req.params.stateId;
      const data = await this._validateData(req.body, id);
      await State.update(data, {
        where: {
          id: id
        }
      });
      Log.create({
        description: 'State updated.',
      });
      res.json(await State.findByPk(id));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static delete = async (req: Request, res: Response) => {
    await State.destroy({
      where: {
        id: req.params.stateId
      }
    });
    Log.create({
      description: 'State delete.',
    });
    res.json({});
  }

  static _validateData = async (data: any, id: any) => {
    const attributes: any = ['name', 'province'];
    const state: any = {};
    for (const attribute of attributes) {
      if (!data[attribute]) {
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      state[attribute] = data[attribute];
    }

    if (await this._checkIfProvinceExists(state.province, id)) {
      throw new Error(`The state with province "${state.province}" already exists.`);
    }

    return state;
  }

  static _checkIfProvinceExists = async (province: string, id: Number) => {
    const where: any = {
      province: province
    };

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await State.count({
      where: where
    });

    return count > 0;
  }

}

