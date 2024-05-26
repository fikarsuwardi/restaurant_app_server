const { readPayload } = require('../helpers/token')
const { User } = require('../models/index')

const authenticationPublic = async (req, res, next) => {
    try {
        const { access_token } = req.headers;

        const payload = readPayload(access_token);

        const findUser = await User.findByPk(+payload.id)

        if (!findUser) {
            throw new Error("CUSTOMER_NOT_FOUND")
        }

        req.additionalDataCustomer = {
            id: findUser.id,
            email: findUser.email,
            role: findUser.role
        }

        if(req.additionalDataCustomer.role !== "customer") {
            throw new Error("CUSTOMER_NOT_FOUND")
        }

        next()
    } catch (err) {
        next(err)
    }
}

module.exports = authenticationPublic