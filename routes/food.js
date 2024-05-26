'use strict'

const express = require('express')
const foodRoutes = express.Router()
const Controller = require("../controllers/foodController")
const authorization = require("../middlewares/authz")
const authorizationStatus = require("../middlewares/authzStatus")

// POST /food/
foodRoutes.post("/", Controller.postFood)

// GET /food/
foodRoutes.get("/",  Controller.getFood)

// GET /food/:id
foodRoutes.get("/:id", Controller.getFoodById)

// PUT /food/:id
foodRoutes.put("/:id", authorization, Controller.putFoodById)

// DELETE /food/:id
foodRoutes.delete("/:id", authorization, Controller.deleteFoodById)

// PATCH /food/:id
foodRoutes.patch("/:id", authorizationStatus, Controller.foodStatus)

module.exports = foodRoutes