'use strict'

var jwt = require('jwt-simple'),
    config = require('../config.js');
var moment = require('moment');

var secret = config.secret

//Comprobamos si vienen los headers
exports.ensureAuth = function ensureAuth(req, res, next) {
    
    if (!req.headers.authorization) {
        return res.status(403).send({ 
            message: 'Invalid request, empty authorization header' 
        })
    }
    //Limpiamos los espacios
    var token = req.headers.authorization.replace(/['"]+/g, '')
    try {
        //Desciframos el token
        var payload = jwt.decode(token, secret)
        //Verificamos expiración
        if (payload.exp <= moment.unix()) {
            return res.status(401).send({ message: 'Expired Token' })
        }
    } catch (ex) {
        console.log(ex)
        //Si no es un token valido tiramos un mensaje y estatus 401
        return res.status(401).send({ message: 'Not Authorized, invalid token' })
    }
    //Si todo sale bien se guarda el payload en el objeto user del request
    req.user = payload;
    next();
};


