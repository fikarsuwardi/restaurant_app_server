'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Food extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Food.belongsTo(models.User, {foreignKey: "authorId"})
      Food.belongsTo(models.Category, {foreignKey: "categoryId"})
      Food.hasMany(models.History, {foreignKey: "FoodId"})
      Food.hasMany(models.Favorite)
    }
  }
  Food.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Name can't be null"
        },
        notEmpty: {
          msg: "Name can't be empty"
        }
      }
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Description can't be null"
        },
        notEmpty: {
          msg: "Description can't be empty"
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Price can't be null"
        },
        notEmpty: {
          msg: "Price can't be empty"
        },
        min: {
          args: 1000,
          msg: "Minimum price is 1000"
        }
      }
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Image can't be null"
        },
        notEmpty: {
          msg: "Image can't be empty"
        }
      }
    },
    authorId: DataTypes.INTEGER,
    categoryId: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [["active", "inactive", "archived"]],
          msg: "Status can only be set to active, inactive or archived",
        },
      },
    },
    
  }, {
    sequelize,
    modelName: 'Food',
  });
  return Food;
};