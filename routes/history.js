'use strict'

const express = require('express')
const historyRoutes = express.Router()
const Controller = require("../controllers/historyController")

// GET /history/
historyRoutes.get("/", Controller.history)

module.exports = historyRoutes