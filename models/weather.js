'use strict';
module.exports = (sequelize, DataTypes) => {
  var weather = sequelize.define('weather', {
    url: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.preference.belongsTo(models.user);
      }
    }
  });
  return weather;
};