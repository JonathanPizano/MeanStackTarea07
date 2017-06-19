'use strict'

var jwt = require('jwt-simple'),
    config = require('../config.js');
//Obtiene la fecha de creacion del token y la expiracion del token
var moment = require('moment');
var secret = config.secret

exports.createToken = function createToken(user) {
    var payload = {
        sub: user._id, //ID de documento de la bd, cliente
        username: user.username, //Username
        email: user.email,
        password: user.password,
        active: user.active,
        role: user.role,
        iat: moment().unix(), //Fecha de creacion del token
        exp: moment().add(30, 'days').unix() //Fecha de expiracion del token
    };
    return jwt.encode(payload, secret);
};
