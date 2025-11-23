import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Favorite = sequelize.define('Favorite', {
  imdbID: {
    type: DataTypes.STRING,
    allowNull: false
  },
  title: DataTypes.STRING,
  year: DataTypes.STRING,
  poster: DataTypes.TEXT
});

User.hasMany(Favorite);
Favorite.belongsTo(User);

export default Favorite;