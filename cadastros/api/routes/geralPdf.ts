import express, { Express, Request, Response } from 'express';
import * as fs from 'fs';
import {User} from '../models/User'
const pdf = require('html-pdf');
const router = require('express').Router();
import {UserController} from '../controllers/UsersController'




const app = express();
router.get('/gerarPdf', UserController.generatePDF);
router.get('/gerarCsv', UserController.csv)


export default router;