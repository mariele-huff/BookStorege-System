import { Op } from 'sequelize';
import { User } from '../models/User';
import { Md5 } from 'ts-md5'
import { Log } from '../models/logModel';
import nodemailer from 'nodemailer';
import * as fs from 'fs';
const pdf = require('html-pdf');
import express, { Express, NextFunction, Request, Response } from 'express';


const emailUser = process.env.EMAIL_USER as string
const emailPass = process.env.EMAIL_PASSWORD as string
export class UserController {

  static index = async (req: Request, res: Response) => {
    const params: any = req.query;
    const limit: any = params.limit || 100;
    const page: any = params.page || 1;
    const offset: any = (page - 1) * limit;
    const sort: any = params.sort || 'id';
    const order: any = params.order || 'ASC';
    const where: any = {};

    if (params.name) {
      where.name = {
        [Op.iLike]: `%${params.name}%`
      };
    }

    if (params.email) {
      where.email = {
        [Op.iLike]: `%${params.email}%`
      };
    }

    if (params.age) {
      where.age =
        params.age

    }

    if (params.sex) {
      where.sex = params.sex;
    }

    const users = await User.findAll({
      where: where,
      limit: limit,
      offset: offset,
      order: [[sort, order]]
    });
    res.json(users);
  }

 static generatePDF = async (req: Request, res: Response) =>{
    const dados = await  User.findAll()
    
    let html = `<h2>Relatório de Usuários</h>`
    html += `<table border="1" style="width:100%">`
         html+= `<th> Id </th>`
         html+= `<th> Name </th>`
         html+= `<th> Age </th>`
         html+= `<th> Sex </th>`
         html+= `<th> Email </th>`;

    dados.forEach(function(dados: any){
         
        html+=` 
        <tr>
            <td>${dados.id}</td>
            <td>${dados.name}</td>
            <td>${dados.age}</td>
            <td>${dados.sex}</td>
            <td>${dados.email}</td>

        </tr>
    `
    })
    html += `</table>`
   

    pdf.create(html, {/*...*/ childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' } } }).toBuffer((err: any, buffer: any) => {
        if (err) {
            return res.status(500).json(err)
        }

        res.end(buffer)
    })
}



  static csv = async (req: Request, res: Response) => {
    const users = await  User.findAll();
    let csv : string =`name;age;sex;email`;

    users.forEach(function (user) { 
      csv += `${user.name}; ${user.age}; ${user.sex}; ${user.email}`
    })
    
    
  
    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="usuarios.csv"');
    res.header('Pragma', 'attachment; no-cache' );
    res.header('Expires', '0');

    res.send(csv)

  }


  static create = async (req: Request, res: Response) => {
    try {
      req.body.password = Md5.hashStr(req.body.password)
      const data = await this._validateData(req.body, req.params.userId);
      const user = await User.create(data);
      Log.create({
        description: 'User created.',
      });
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static enviarEmail = async (req: Request, res: Response) => {
    try {
      let email_user = emailUser;
      let email_pass = emailPass
      let email_to = req.params.email;
      let email_subject = 'Oi ';
      let email_content = 'testando api';


      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: email_user,
          pass: email_pass
        }
      });

      var mailOptions = {
        from: email_user,
        to: email_to,
        subject: email_subject,
        text: email_content
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(info.response);
        }

      });
      Log.create({
        description: `Email enviado`,
      });

    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static show = async (req: Request, res: Response) => {
    const user = await User.findByPk(req.params.userId);
    res.json(user);
  }

  static update = async (req: Request, res: Response) => {
    try {
      const id = req.params.userId;
      const data = await this._validateData(req.body, id);
      await User.update(data, {
        where: {
          id: id
        }
      });
      Log.create({
        description: 'User updated.',
      });
      res.json(await User.findByPk(id));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static delete = async (req: Request, res: Response) => {
    await User.destroy({
      where: {
        id: req.params.userId
      }
    });
    Log.create({
      description: 'User delete.',
    });
    res.json({});
  }

  static _validateData = async (data: any, id: any) => {
    const attributes: any = ['name', 'age', 'sex', 'email', 'password'];
    const user: any = {};
    for (const attribute of attributes) {
      if (!data[attribute]) {
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      user[attribute] = data[attribute];
    }

    if (await this._checkIfEmailExists(user.email, id)) {
      throw new Error(`The user with mail address "${user.email}" already exists.`);
    }

    return user;
  }

  static _checkIfEmailExists = async (email: string, id: any) => {
    const where: any = {
      email: email
    };

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await User.count({
      where: where
    });

    return count > 0;
  }

}


