import { DataTypes, Model, Sequelize } from 'sequelize';
import db from '../db/conexao';
import {City} from './City';

export class Publisher extends Model { };

Publisher.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: db,
  tableName: 'publisher',
  modelName: 'Publisher'
});

City.hasMany(Publisher,{
  foreignKey:{
    allowNull:false
  }
});
Publisher.belongsTo(City,{

});
