"use strict";

const { Food, Category } = require("../models");

class Controller {
    static async category(req, res, next) {
        try {
            const category = await Category.findAll({
                include: [Food],
                order: [['id','ASC']]
            })

            res.status(200).json({
                statusCode: 200,
                category,
            });

        } catch (err) {
            next(err);
        }
    }
}

module.exports = Controller;
