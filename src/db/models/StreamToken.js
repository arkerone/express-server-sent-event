/* eslint-disable no-param-reassign */
const { crypto } = require('../../services');

module.exports = (sequelize, dataTypes) => {
  const StreamToken = sequelize.define(
    'StreamToken',
    {
      id: {
        field: 'id',
        type: dataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      token: {
        field: 'token',
        type: dataTypes.STRING,
        allowNull: false
      },
      expiresAt: {
        field: 'expires_at',
        type: dataTypes.DATE,
        allowNull: false
      },
      userId: {
        field: 'user_id',
        type: dataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'user',
          key: 'id'
        }
      }
    },
    {
      tableName: 'stream_token',
      freezeTableName: true,
      underscored: true,
      hooks: {
        beforeCreate: streamToken => {
          streamToken.token = crypto.hash('sha256', streamToken.token);
        },
        beforeFind: options => {
          if (options.where) {
            if (options.where.token) {
              options.where.token = crypto.hash('sha256', options.where.token);
            }
          }
        },
        beforeBulkDestroy: options => {
          if (options.where) {
            if (options.where.token) {
              options.where.token = crypto.hash('sha256', options.where.token);
            }
          }
        }
      }
    }
  );

  StreamToken.associate = models => {
    StreamToken.belongsTo(models.User, {
      as: 'user',
      foreignKey: 'userId',
      targetKey: 'id'
    });
  };

  return StreamToken;
};
