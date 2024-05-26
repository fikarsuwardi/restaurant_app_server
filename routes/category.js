'use strict'

const express = require('express')
const categoryRoutes = express.Router()
const Controller = require("../controllers/categoryController")

// GET /category/
categoryRoutes.get("/", Controller.category)

module.exports = categoryRoutes