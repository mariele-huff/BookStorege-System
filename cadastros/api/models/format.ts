import { DataTypes, Model } from 'sequelize';
import db from '../db/conexao';

export class Format extends Model{}

Format.init(
{ id:
    {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    description :
    {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: db,
    tableName: 'format',
    modelName: 'Format'

})
