// Model Foodnya !
const { Food } = require("../models/index")

const authorization = async (req, res, next) => {
    try {
        const currentUserId = req.additionalData.id
        const role = req.additionalData.role
        const foodId = +req.params.id

        // Querynya !
        const food = await Food.findByPk(foodId)

        if (!food) {
            throw new Error("FOOD_NOT_FOUND")
        }

        if (role !== "admin") {
            if (currentUserId !== food.authorId) {
                throw new Error("NOT_ALLOWED")
            }
        }
        next() // ini jngn dihapussss
    } catch (err) {
        next(err);
    }
}

module.exports = authorization