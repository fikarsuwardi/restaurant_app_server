'use strict'

const routes = require('express').Router()

const userRoutes = require('./user')
const publicRoutes = require('./public')

const categoryRoutes = require('./category')
const foodRoutes = require('./food')
const historyRoutes = require('./history')

const authentication = require("../middlewares/authn")

routes.use('/user', userRoutes)
routes.use('/public', publicRoutes)

routes.use('/category', authentication, categoryRoutes)
routes.use('/food', authentication, foodRoutes)
routes.use('/history', authentication, historyRoutes)


module.exports = routes