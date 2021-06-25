'use strict';
module.exports = (sequelize, DataTypes) => {
  const product = sequelize.define('product', {
    categories: DataTypes.INTEGER,
    image: DataTypes.TEXT,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {});
  product.associate = function(models) {
    // associations can be defined here
    product.belongsTo(models.category,{foreignKey:'categories', as:'category'})
  };
  return product;
};