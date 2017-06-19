'use strict'

var express = require('express');
var UserController = require('../controllers/user')

var api = express.Router();
var md_auth = require('../middlewares/authenticated')
var md_user = require('../middlewares/user')

api.post('/user/register',
                md_user.userValidation,
                UserController.initPostUser,
                UserController.postUser);

api.post('/user/login',
                md_user.userValidation,
                md_user.findUserByEmail,
                UserController.loginUser);

api.delete('/user/delete/:userId?',
                md_auth.ensureAuth,
                md_user.userIdParamsValidation,
                md_user.findUserById,
                UserController.deleteUser);                

module.exports = api;