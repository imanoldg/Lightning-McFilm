import sequelize from '../config/database.js';
import User from './User.js';
import Favorite from './Favorite.js';

const syncDB = async () => {
  await sequelize.sync({ alter: true });
  console.log('MySQL sincronizado - Tablas creadas/actualizadas');
};

export { sequelize, User, Favorite, syncDB };