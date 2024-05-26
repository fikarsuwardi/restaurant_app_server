"use strict";

const { Food, User, History } = require("../models");

class Controller {
    static async history(req, res, next) {
        try {
            const history = await History.findAll({
                include: [Food],
                order: [['id','DESC']]
            })

            res.status(200).json({
                statusCode: 200,
                history,
            });

        } catch (err) {
            next(err);
        }
    }
}

module.exports = Controller;
