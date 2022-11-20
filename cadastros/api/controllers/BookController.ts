import { Op } from 'sequelize';
import {Book} from '../models/Book';
import {Log} from '../models/logModel';
import {Category} from '../models/Category';
import {Publisher} from '../models/Publisher';
import {Format} from '../models/format';
import express, { Express, NextFunction, Request, Response } from 'express';

export class BookController {
 
  static index = async (req: Request, res:Response ) => {
    const params: any = req.query;
    let sort: any = params.sort || 'id';
    let order: any = params.order || 'ASC';
    const where: any = {};


    if (sort == 'Category') {
      sort = { model: Category};
      order = 'description', 'DESC';
    }
    if (params.title) {
      where.title = {
        [Op.iLike]: `%${params.title}%`
      }
    }
  
    if (params.author) {
      where.author = {
        [Op.iLike]: `%${params.author}%`
      }
    }

    if(params.CategoryId){
      params.sort = {
        [Op.iLike]:`%${params.CategoryId}`
      }
    }
  

    const book = await Book.findAll({

      include: [{
        model: Category,
        required: false,
        attributes: ['description']
      },
      {
        model: Publisher,
        required: false,
        attributes: ['name']
      },
      {
        model: Format,
      required: false,
      attributes: ['description'] 
      }
     
    ],
    where: where,
    order: [ [sort, order] ]

    });
    res.json(book);
  }

  static create = async (req: Request, res: Response) => {
    try {
      const data = await this._validateData(req.body, req.params.bookId);
      const book = await Book.create(data);
      res.json(book);
      Log.create({
        description: 'Book created.',
      })
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static show = async (req: Request, res: Response) => {
    const book = await Book.findByPk(req.params.bookId);
    res.json(book);
  }

  static update = async (req: Request, res: Response) => {
    try {
      const id: any = req.params.bookId;
      const data = await this._validateData(req.body,  req.params.bookId);
      await Book.update(data, {
        where: {
          id: id
        }
      });
      Log.create({
        description: 'Book updated.',
      });
      res.json(await Book.findByPk(id));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static delete = async (req: Request, res: Response) => {
    await Book.destroy({
      where: {
        id: req.params.bookId
      }
    });
    Log.create({
      description: 'Book deleted.',
    });
    res.json({});
  }

  static _validateData = async (data: string, id:any) => {
    const attributes : any = ['title', 'author', 'publication_year', 'pages','value', 'CategoryId', 'PublisherId', 'FormatId'];
    const book : any = {};
    for (const attribute of attributes) {
      if (!data[attribute]) {
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      book[attribute] = data[attribute];
    }

    if (await this._checkIfTitleExists(book.title, id)) {
      throw new Error(`The book with title "${book.title}" already exists.`);
    }

    return book;
  }

  static _checkIfTitleExists = async (title: string, id: Number) => {
    const where : any= {
      title: title
    };

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await Book.count({
      where: where
    });

    return count > 0;
  }

}

