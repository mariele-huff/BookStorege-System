import { DataTypes, Model } from 'sequelize';
import db from '../db/conexao';

export class Log extends Model { };

Log.init({
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
}, {
    sequelize: db,
    tableName: 'logs',
    modelName: 'Logs'
});


