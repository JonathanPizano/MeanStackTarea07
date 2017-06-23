'use strict'

var config = require('../config.js');
var brcypt = require('bcrypt-nodejs');
var Product = require('../models/product');
var jwt = require('../services/jwt');
var mongoose = require('mongoose');

exports.productValidation = function productValidation(req,res,next){
    // Verificar un body vacio
    if(Object.keys(req.body).length === 0){
        res.status(409).send({message:'Please send a body'})
    } else {
        next();
    }
};

exports.productIdValidation = function productIdValidation(req,res,next){
    // Verificar un body vacio
    if(req.params.productId){
        if(!mongoose.Types.ObjectId.isValid(req.params.productId)){
            // Si no es valido mostramos un mensaje de Id invaliod
            res.status(409).send({message:'Invalid id'});
        } else {
            next()
        }
    } else {
        res.status(409).send({message:'Provide a productId'})
    }
};

exports.findProductById = function findProductById(req, res, next){
    req.prodObj = {};
    //Buscamos usuario por _id
    Product.find({_id:req.params.productId}).exec()
    .then((desired)=>{
            req.prodObj = desired
            next()
    })    
};

exports.findAll = function findProductById(req, res, next){
    req.prodObj = {};
    //Buscamos a todos los productos de la bd 
    Product.find({}).exec()
    .then((productos)=>{
            req.prodObj = productos
            next()
    }).catch(function(err){
        // Reminder: Revisar si la notacion es correcta y si realmente atrapa errores
        res.status(500).send({message:"Error interno del servidor", err:err})
    })    
};

exports.verifyAdminUser = function verifyAdminUser(req,res,next){
    // Verificar si el usuario es un Administrador o un Usuario
     if(req.user.role == 'ROLE_ADMIN'){
        next();
     } else {
        res.status(401).send({message:"NO ES ADMIN", user:req.user.role})
     }
};