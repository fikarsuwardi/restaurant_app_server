const bcrypt = require('bcryptjs')

// fungsi untuk membuat hash
function hashPassword (password) {
    return bcrypt.hashSync(password, 8)
}

// fungsi untuk membandingkan password dengan hash
const compareHash = (password, hash) => {
    return bcrypt.compareSync(password, hash)
}

module.exports = {
    hashPassword,
    compareHash
} 