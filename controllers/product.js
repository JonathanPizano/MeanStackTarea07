'use strict';

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var Product = require('../models/product');
var mongoose = require('mongoose');
var jwt = require('../services/jwt');

function postProduct(req,res){
    var newProduct = new Product(req.body);
    newProduct.save(function(err,productStored){
        if(err){
            res.status(409).send({message:'Conflicto', err: err})
        } else {
            if(!productStored){
                res.status(409).send({message: 'Producto no guardad'})
            } else {
                res.status(200).send({product:productStored})
            }
        }
    });
}

function updateProduct(req, res){
    Product.findByIdAndUpdate(req.prodObj[0]._id, req.body).exec()
                .then((oldProduct)=>{
                    Product.findById(req.prodObj[0]._id).exec()
                    .then((updatedProduct)=>{
                        res.status(200).send({viejo:oldProduct, nuevo:updatedProduct})
                    })
                    .catch(function(err){
                        res.status(409).send({message:"Conflicto", err:err})  
                    });
                })
                .catch(function(err){
                    res.status(409).send({message:"Conflicto", err:err})
                });    
}

function deleteProduct(req, res){
    console.log(req.prodObj[0]._id)
    Product.findByIdAndRemove(req.prodObj[0]._id).exec()
    .then((deletedProduct) => {
        if(deletedProduct) {
            res.status(200).send({deletedProduct: deletedProduct});
        } else {
            console.log(req.prodObj[0]._id)
            console.log(deletedProduct)
            res.status(200).send({message: 'El producto con el ID ' + req.prodObj[0]._id + ' no existe en BD'});
        }
    })
}

function showProduct(req,res){
    res.status(200).send({Product: req.prodObj[0]})
}

function showAll(req,res){
    res.status(200).send({Productos: req.prodObj})
}

module.exports = {
    postProduct,
    updateProduct,
    deleteProduct,
    showProduct,
    showAll
}