import { Sequelize } from 'sequelize-typescript';
import {config as envConfig} from "dotenv";

envConfig();

const env = process.env;

export const sequelize = new Sequelize({
  database: env.DATABASE_NAME,
  dialect: 'mysql',
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  host: env.DATABASE_HOST,
  models: [__dirname + '/models']
});


export const initializeDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database & tables created!');
  } catch (error) {
    console.error('Unable to create tables, shutting down...', error);
  }
};