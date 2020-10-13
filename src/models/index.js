import Sequelize from 'sequelize';

const sequelize = new Sequelize('tweet_archive_db', 'postgres', 'postgres', {
  dialect: 'postgres',
});

const models = {
  Tweet: require('../models/TweetArchive').default(sequelize, Sequelize.DataTypes)
};

// this handles the model associations
Object.keys(models).forEach(function(modelName) {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models