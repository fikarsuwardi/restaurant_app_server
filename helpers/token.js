const jwt = require("jsonwebtoken")

// ini bikin jwt
const createTokenFromData = (data) => {
    return jwt.sign(data, process.env.JWT_SECRET)
}

// cara baca token/jwt
const readPayload = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET)
}

module.exports = {
    createTokenFromData,
    readPayload
}

