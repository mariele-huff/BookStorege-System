import { DataTypes, Model, Sequelize } from 'sequelize';
import db from '../db/conexao';

export class Category extends Model { };

Category.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  
  }
},
{
  sequelize: db,
  tableName: 'category',
  modelName: 'Category'
  }

);
Category.sync()

