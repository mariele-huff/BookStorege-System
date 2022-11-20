import { DataTypes, Model } from 'sequelize';
import db from '../db/conexao';
import {State} from './State';

export class City extends Model { };

City.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cep:
  {
    type: DataTypes.STRING,
    allowNull:false
  }
}, {
  sequelize: db,
  tableName: 'city',
  modelName: 'City'
});

State.hasMany(City,
  {
    foreignKey:{
      allowNull:false
    }
  });
City.belongsTo(State);

