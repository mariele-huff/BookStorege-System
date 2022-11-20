import cors from 'cors';
const router = require('express').Router();
import Category from './categories';
import City from './cities';
import Publishers from './publishers';
import States from './states';
import Books from './books';
import Users from './users';
import Format from './format';
import Login from './login';
import gerarPdf from './geralPdf'


router.use(cors());

router.use(Format);
router.use(Category);
router.use(City);
router.use(Publishers);
router.use(States);
router.use(Books);
router.use(Users);
router.use(Login);
router.use(gerarPdf);


export default router;


