"use strict"

if(process.env.NODE_ENV !== 'production') {
    require("dotenv").config()
}

// require('dotenv').config()
const cors = require("cors")
const errorHandler = require('./middlewares/errorHandler')
const express = require('express')
const app = express()

const routes = require('./routes')

// // pindah ke bin/www.js
const port = process.env.PORT || 3001; // untuk deploy heroku

//cors
app.use(cors()) // WAJIB

//body
app.use(express.urlencoded({ extended: false }))

//json
app.use(express.json())

//menggunakan routes dari routes/index.js
app.use(routes)

// errorHandler
app.use(errorHandler)

// // pindah ke bin/www
// KALAU MAU TESTING INI DICOMEN
// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })

module.exports = app