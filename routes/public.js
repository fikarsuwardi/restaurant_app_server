'use strict';

const express = require('express')
const publicRoutes = express.Router()
const Controller = require("../controllers/publicController")

const authenticationPublic = require("../middlewares/authnPublic")


// GET /public/ => untuk navigation dan search
publicRoutes.get("/", Controller.publicHome)
// POST /public/register
publicRoutes.post("/register", Controller.publicRegister)
// POST /public/login
publicRoutes.post("/login", Controller.publicLogin)
// POST /public/login-google
publicRoutes.post("/login-google", Controller.publicLoginGoogle)
// GET /public/food
// GABUNG DISINI AJA
publicRoutes.get("/food", Controller.publicAllFood)
// GET /public/category
publicRoutes.get("/category", Controller.publicGetCategory)
// GET /public/qrcode
publicRoutes.get("/qrcode", Controller.publicGetQrCode)
// GET /public/food/id
publicRoutes.get("/food/:id", Controller.publicGetFoodById)

// GET /public/favorite/food
publicRoutes.get("/favorite", authenticationPublic, Controller.publicListFavorite)
// POST /public/favorite/food
publicRoutes.post("/favorite/:id", authenticationPublic, Controller.publicAddFavorite)
// DELETE /public/favorite/food
publicRoutes.delete("/favorite/:id", authenticationPublic, Controller.publicDeleteFavorite)

module.exports = publicRoutes