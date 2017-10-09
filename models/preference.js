'use strict';
module.exports = (sequelize, DataTypes) => {
  var preference = sequelize.define('preference', {
    dashboardColor: DataTypes.STRING,
    facebookColor: DataTypes.STRING,
    twitterColor: DataTypes.STRING,
    navColor: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.preference.belongsTo(models.user);
      }
    }
  });
  return preference;
};