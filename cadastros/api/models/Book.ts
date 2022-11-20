import { DataTypes, Model } from 'sequelize';
import db from '../db/conexao';
import {Publisher} from './Publisher';
import {Category} from './Category';
import {Format} from './format';

export class Book extends Model { };

Book.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  author: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  publication_year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pages: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  value: {
    type: DataTypes.DECIMAL,
    allowNull: false
  }
}, {
  sequelize: db,
  tableName: 'book',
  modelName: 'Book'
});

Publisher.hasMany(Book,
  {
    foreignKey: {
      allowNull:false
    }
  });
Book.belongsTo(Publisher);

Category.hasMany(Book,
  {
    foreignKey: {
      allowNull:false
    }
  });
Book.belongsTo(Category);

Format.hasMany(Book, 
  {
    foreignKey:
    {
      allowNull:false
    }
  })
  Book.belongsTo(Format);



