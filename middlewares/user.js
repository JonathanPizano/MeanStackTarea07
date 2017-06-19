'use strict'

var brcypt = require('bcrypt-nodejs');
var User = require('../models/user');
var jwt = require('../services/jwt');
var mongoose = require('mongoose');

/*var secret = config.secret

//Comprobamos si vienen los headers
exports.ensureAuth = function ensureAuth(req, res, next){

    if(!req.headers.authorization){
        return res.status(403).send({
            message: 'Invalid request, empty authorization header'
        })
    }
    // Limpiamos los espacios
    var token = req.headers.authorization.replace(/['"]+/g, '')
    try{
        //Desciframos el token
        var payload = jwt.decode(token, secret)
        //Verificamos expiracion
        if(payload.exp <= moment.unix()){
            return res.status(401).send({message:'expired token'})
        }
    }catch(ex){
        console.log(ex)
        // Si no es un token valido tiramos un mensaje y status 401
        return res.status(401).send({message:'Not Authorized, invalid token'})
    }
    //Si todo sale bien se guarda el payload en el objeto user del request
    req.user = payload;
    next();
};*/


exports.userValidation = function userValidation(req,res,next){
    // Verificar un body vacio
    if(Object.keys(req.body).length === 0){
        res.status(409).send({message:'Please send a body'})
    } else {
        if(req.body.email){
            req.body.email = req.body.email.toLowerCase();
        }
        if(req.body.username){
            req.body.username = req.body.username.toLowerCase();
        }
        next();
    }
};

exports.findUserByEmail = function findUserByEmail(req,res,next){
    req.userObj = {};
    req.userObj = User.findOne({email:req.body.email.toLowerCase()}).exec()
    next();
}

exports.userIdParamsValidation = function(req,res,next){
    //Verificamos que el id proporcionado en la url sea valido
    if(req.params.userId){
        if(!mongoose.Types.ObjectId.isValid(req.params.userId)){
            // Si no es valido mostramos un mensaje de Id invaliod
            res.status(409).send({message:'Invalid id'});
        } else {
            next()
        }
    } else {
        res.status(409).send({message:'Provide a userId'})
    }
}

exports.findUserById = function(req,res,next){
    req.userObj = {};
    //Buscamos usuario por _id
    req.userObj = User.findOne({_id:req.params.userId}).exec();
    next()
}



