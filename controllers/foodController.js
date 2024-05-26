"use strict";

const { Food, Category, User, History } = require("../models");

class Controller {
    static async postFood(req, res, next) { // create food
        try {
            const { name, description, price, imgUrl, categoryId } = req.body;
            const newFood = await Food.create({
                name,
                description,
                price,
                imgUrl,
                authorId: +req.additionalData.id,
                categoryId,
                status: "active"
            });

            const history = await History.create({
                name: newFood.name,
                description: `New Food with id ${newFood.id} has created`,
                updatedBy: req.additionalData.email,
                FoodId: newFood.id
            });

            // Berhasil bikin databaru
            res.status(201).json({
                statusCode: 201,
                message: "Food created successfully",
                data: newFood,
            });
        } catch (err) {
            next(err);
        }
    }

    static async getFood(req, res, next) { // List All Food
        try {
            const food = await Food.findAll({
                include: [User, Category],
                order: [['id','DESC']]
            });
            res.status(200).json({
                statusCode: 200,
                data: food,
            });

        } catch (err) {
            next(err);
        }
    }

    static async getFoodById(req, res, next) {
        try {
            const foodId = +req.params.id;
            const detailFood = await Food.findOne({
                where: {
                    id: foodId,
                },
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

    static async putFoodById(req, res, next) {
        try {
            const foodId = +req.params.id;
            const { name, description, price, imgUrl, categoryId } = req.body;
            const input = {
                name,
                description,
                price,
                imgUrl,
                authorId: +req.additionalData.id,
                categoryId,
            };
            
            const updateFood = await Food.update(input, {
                where: {
                    id: foodId,
                },
            });

            if (updateFood <= 0) {
                throw new Error("FOOD_NOT_FOUND");
            }

            const history = await History.create({
                name: input.name,
                description: `Food with id ${foodId} has updated`,
                updatedBy: req.additionalData.email,
                FoodId: +foodId
            });

            res.status(200).json({
                statusCode: 200,
                message: "Food has been updated successfully",
                data: input,
            });

        } catch (err) {
            next(err);
        }
    }

    static async deleteFoodById(req, res, next) {
        try {
            const foodId = +req.params.id;
            const destroyFood = await Food.destroy({
                where: {
                    id: foodId,
                },
            });

            if (destroyFood <= 0) {
                throw new Error("FOOD_NOT_FOUND");
            }
            
            res.status(200).json({
                statusCode: 200,
                message: `Food with id ${foodId} deleted successfully`,
            });

        } catch (err) {
            next(err);
        }
    }

    static async foodStatus(req, res, next) {
        try {
            const foodId = +req.params.id;
            const { status } = req.body
            const input = { status }

            const currentUserEmail = req.additionalData.email

            const currentFood = await Food.findByPk(foodId);

            const updateStatusFood = await Food.update(input, {
                where: {
                    id: foodId,
                    },
                }
            );
            
            if (updateStatusFood <= 0) {
                throw new Error("FOOD_NOT_FOUND");
            }

            const history = await History.create({
                name: currentFood.name,
                description: `Food with id ${foodId} has been updated from ${currentFood.status} to ${status}`,
                updatedBy: currentUserEmail,
                FoodId: +foodId
            });

            res.status(200).json({
                statusCode: 200,
                message: `Food status has been updated from ${currentFood.status} to ${status}`,
            });

        } catch (err) {
            next(err);
        }
    }
}

module.exports = Controller;
