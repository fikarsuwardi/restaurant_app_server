"use strict"

const { compareHash } = require("../helpers/bcrypt");
const { createTokenFromData } = require("../helpers/token");
const { User, Food } = require("../models/index")
const { OAuth2Client } = require('google-auth-library');

class Controller {
    static async listUser(req, res, next) { // List All Food
        try {
            const findUser = await User.findAll({
                include: [Food],
                attributes: {exclude: ["password","phoneNumber","address","createdAt","updatedAt"]},
                order: [['id','DESC']]
            });
            res.status(200).json({
                statusCode: 200,
                data: findUser
            });

        } catch (err) {
            next(err);
        }
    }

    static async register(req, res, next) {
        try {
            const { username, email, password, phoneNumber, address } = req.body
            const newUser = await User.create({
                username,
                email,
                password,
                role: "admin",
                phoneNumber,
                address
            });

            if (!newUser) {
                throw new Error("REGISTRATION_FAILED")
            }

            res.status(201).json({
                statusCode: 201,
                message: "Succes created user",
                data: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    role: newUser.role
                }
            })
        } catch (err) {
            next(err)
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body

            const foundUser = await User.findOne({
                where: {
                    email
                }
            });

            if (!foundUser) {
                throw new Error("USER_NOT_FOUND")
            }

            const correctPassword = compareHash(password, foundUser.password)

            if (!correctPassword) {
                throw new Error("INVALID_PASSWORD")
            }

            //bikin payload dulu
            const payload = {
                id: foundUser.id,
                username: foundUser.username,
                email: foundUser.email,
                role: foundUser.role    
            }

            const access_token = createTokenFromData(payload);

            res.status(200).json({
                statusCode: 200,
                message: "Succes Login",
                access_token: access_token,
                payload
            })

        } catch (err) {
            next(err)
        }
    }

    static async loginGoogle(req, res, next) {
        try {
            const client = new OAuth2Client(process.env.client_id);
            const ticket = await client.verifyIdToken({
                idToken: req.body.credential,
                audience: process.env.client_id,
            });
            const payload = ticket.getPayload();
            const [user] = await User.findOrCreate({
                where: { email: payload.email },
                defaults: {
                    username: 'staffGoogle',
                    password: "123456",
                    role: 'staff',
                    phoneNumber: "123456",
                    address: "googleAddress"
                }
            })

            console.log(user, "ini user");
            const dataUser = {
                id: +user.id,
                email: user.email,
                role: user.role, 
            }

            const access_token = createTokenFromData(dataUser)

            res.status(200).json({
                statusCode: 200,
                message: "Login Google Succes",
                access_token,
                dataUser
            })
            
        } catch (err) {
            next(err)
        }
    }
}

module.exports = Controller