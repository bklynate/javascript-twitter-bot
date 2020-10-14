import { config } from 'dotenv';
import Sequelize from 'sequelize';

config();

const sequelize = new Sequelize('tweet_archive_db', process.env.POSTGRES_USERNAME, process.env.POSTGRES_PASSWORD, {
  dialect: 'postgres',
});

const models = {
  Tweet: require('../models/TweetArchive').default(sequelize, Sequelize.DataTypes)
};

// this handles the model associations
Object.keys(models).forEach(function (modelName) {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models