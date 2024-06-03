const app = require("../app")

// const port = process.env.PORT || 3001;
const port = 3001;


// pindah ke bin/www
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

module.exports = app
// nodemon bin/www