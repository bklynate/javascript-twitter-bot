export default (sequelize, DataTypes) => {
  const Tweet = sequelize.define('tweet', {
    tweet_id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
    },
    text: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    screen_name: {
      type: DataTypes.STRING,
    },
    created_at: {
      type: 'TIMESTAMP',
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false,
    },
  })

  return Tweet
}
