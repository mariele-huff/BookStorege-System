const router = require('express').Router();
import express, { Express, NextFunction, Request, Response } from 'express';
import {User} from '../models/User';

async function authenticate (req: Request) {
    let authorization = req.headers.authorization+"";
    authorization = authorization.replace("Basic ", '')
    let ascii = Buffer.from(authorization, 'base64').toString('ascii')
    let dados = ascii.split(':')
    console.log(authorization)
    console.log(ascii)
 
    let username = dados[0]
    let password = dados[1]
 
    let logado = await User.localizaUsuario(username, password)
    console.log(logado?.toJSON())
    return logado
 
 }
 router.post('/auth', async function (req: Request, res: Response) {
   res.json(await authenticate(req))
})
 router.get('/auth', async function (req: Request, res: Response) {
    res.json(await authenticate(req))
 })
 router.get('/verify',async function (req: Request, res: Response) {
     res.json(await authenticate(req))
  })
 
 
 


  export default router;