"use strict";

const { compareHash } = require("../helpers/bcrypt");
const { createTokenFromData } = require("../helpers/token");
const { Food, User, Category, Favorite } = require("../models/index");
const { OAuth2Client } = require("google-auth-library");
const { Op } = require("sequelize");
const axios = require("axios");

class Controller {
  static async publicHome(req, res, next) {
    try {
      const options = {
        limit: 9,
        order: [["id", "ASC"]],
        include: [User, Category],
        where: {
          status: "active",
        },
      };

      if (!req.query.page || +req.query.page === 0) {
        req.query.page = 1;
      }

      options.offset = (req.query.page - 1) * options.limit;

      if (req.query.name) {
        options.where = {
          name: {
            [Op.iLike]: `%${req.query.name}%`,
          },
        };
      }

      if (+req.query.minprice) {
        options.where = {
          price: {
            [Op.lte]: `${+req.query.minprice}`,
          },
        };
      }

      if (req.query.name && +req.query.minprice) {
        options.where = {
          name: {
            [Op.iLike]: `%${req.query.name}%`,
          },
          price: {
            [Op.lte]: `${+req.query.minprice}`,
          },
        };
      }

      const food = await Food.findAndCountAll(options, {});
      let totalPage = Math.ceil(food.count / 9)

      res.status(200).json({
        statusCode: 200,
        page: +req.query.page,
        totalPage: totalPage,
        data: food,
        
      });
    } catch (err) {
      next(err);
    }
  }

  static async publicRegister(req, res, next) {
    try {
      const { username, email, password, phoneNumber, address } = req.body;
      const newUser = await User.create({
        username,
        email,
        password,
        role: "customer",
        phoneNumber,
        address,
      });

      if (!newUser) {
        throw new Error("REGISTRATION_FAILED");
      }

      res.status(201).json({
        statusCode: 201,
        message: "Succes created user",
        data: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static async publicLogin(req, res, next) {
    try {
      const { email, password } = req.body;

      const foundUser = await User.findOne({
        where: {
          email,
          role: "customer",
        },
      });

      // console.log(foundUser, "ini found user");

      if (!foundUser) {
        throw new Error("USER_NOT_FOUND");
      }

      const correctPassword = compareHash(password, foundUser.password);

      if (!correctPassword) {
        throw new Error("INVALID_PASSWORD");
      }

      //bikin payload dulu
      const payload = {
        id: foundUser.id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
      };

      const access_token = createTokenFromData(payload);

      res.status(200).json({
        statusCode: 200,
        message: "Succes Login",
        access_token: access_token,
        payload,
      });
    } catch (err) {
      next(err);
    }
  }

  static async publicLoginGoogle(req, res, next) {
    try {
      const client = new OAuth2Client(process.env.client_id);
      const ticket = await client.verifyIdToken({
        idToken: req.body.credential,
        audience: process.env.client_id,
      });
      const payload = ticket.getPayload();
      const [user] = await User.findOrCreate({
        where: { email: payload.email },
        defaults: {
          username: "customerGoogle",
          password: "123456",
          role: "customer",
          phoneNumber: "123456",
          address: "googleAddress",
        },
      });

      console.log(user, "ini user");
      const dataUser = {
        id: +user.id,
        email: user.email,
        role: user.role,
      };

      const access_token = createTokenFromData(dataUser);

      res.status(200).json({
        statusCode: 200,
        message: "Login Google Succes",
        access_token,
        dataUser,
      });
    } catch (err) {
      next(err);
    }
  }

  static async publicAllFood(req, res, next) {
    try {
      const food = await Food.findAll({
        where: {
          status: "active",
        },
        include: [User, Category],
        order: [["id", "DESC"]],
      });
      res.status(200).json({
        statusCode: 200,
        data: food,
      });
    } catch (err) {
      next(err);
    }
  }

  static async publicGetFoodById(req, res, next) {
    try {
      const foodId = +req.params.id;
      const detailFood = await Food.findOne({
        where: {
          status: "active",
          id: foodId,
        },
        include: [User, Category],
      });
      if (!detailFood) {
        throw new Error("FOOD_NOT_FOUND");
      }

      res.status(200).json({
        statusCode: 200,
        data: detailFood,
      });
    } catch (err) {
      next(err);
    }
  }

  static async publicGetQrCode(req, res, next) {
    try {
      const urlDetail = req.body.data;
      const myApiKey =
        "19659enue0wh0vNd6zF7okREt9YO7wb6OXNnIvheKifUUHd2Te42Vwg5";

      const response = await axios.get(
        `https://api.happi.dev/v1/qrcode?data=${urlDetail}&apikey=${myApiKey}`
      );
      res.status(200).json({
        code: response.data.qrcode,   
      });
    } catch (err) {
      next(err)
    }
  }

  static async publicListFavorite(req, res, next) {
    try {
      const id = req.additionalDataCustomer.id;
      const favorite = await Favorite.findAll({
        where: {
          UserId: id,
        },
        include: [User, Food],
        order: [["id", "ASC"]],
      });

      res.status(200).json({
        statusCode: 200,
        data: favorite,
      });
    } catch (err) {
      next(err);
    }
  }

  static async publicAddFavorite(req, res, next) {
    try {
      const foodId = +req.params.id;
      const customerId = +req.additionalDataCustomer.id;

      const findFood = await Food.findOne({
        where: {
          id: foodId,
        },
      });

      if (!findFood) {
        throw new Error("FOOD_NOT_FOUND");
      }

      const created = await Favorite.findOrCreate({
        where: {
          FoodId: foodId,
          UserId: customerId,
        },
      });

      // console.log(created[1]);

      if (created[1] === false) {
        throw new Error("FOOD_ALREADY_FAVORITE");
      }

      res.status(201).json({
        statusCode: 201,
        message: `Food id ${foodId} successfully added to favorite`,
        data: created[0],
      });
    } catch (err) {
      next(err);
    }
  }

  static async publicGetCategory(req, res, next) {
    try {
      const category = await Category.findAll({
        include: [Food],
        order: [["id", "ASC"]],
      });

      res.status(200).json({
        statusCode: 200,
        category,
      });
    } catch (err) {
      next(err);
    }
  }

  static async publicDeleteFavorite(req, res, next) {
    try {
      const favoriteId = +req.params.id;

      const deleteFavorite = await Favorite.destroy({
        where: {
          id: favoriteId,
        },
      });

      if (!deleteFavorite) {
        throw new Error("FOOD_NOT_FOUND");
      }

      res.status(200).json({
        statusCode: 200,
        message: `Favorite with id ${favoriteId} deleted successfully`,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
