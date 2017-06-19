'use strict'

var bcrypt = require('bcrypt-nodejs');
var User = require('../models/user');
var mongoose = require('mongoose');
var jwt = require('../services/jwt');

function initPostUser(req, res, next){
    var newUser = new User(req.body)
    req.newUserObj = {}

    if(req.body.password){
        //Ciframos contraseña y guardamos
        bcrypt.hash(req.body.password, null, null, function(err, hash){
            newUser.password = hash;
        });
    }

    req.newUserObj = newUser;
    next();
}

function postUser(req,res){
    req.newUserObj.save(function(err,userStored){
        if(err){
            res.status(409).send({err})
        } else {
            if(userStored){
                res.status(200).send({user:userStored})
            }
        }
    });
}

function loginUser(req,res){
    req.userObj.then((user)=>{
        if(user != null){
        //Comprobamos la contraseña
            bcrypt.compare(req.body.password, user.password, function(error, check){
                if(check){
                    //Devolvemos al usuario logeado
                    //Generaremos un Token 
                    if(req.body.token){
                        //Devolvemos un token
                        var token = jwt.createToken(user)
                        res.status(200).send({token:token, user:user})
                    } else {    
                        res.status(200).send({user:user})
                    }
                } else {
                    res.status(409).send({error:'Invalido Password'})
                }
            });
        } else {
            res.status(404).send({message:"User not found"})
        }
    })
    .catch((err)=>{
        res.status(500).send({message:'Internal server error', err:err})
    });
}

function deleteUser(req,res){
    if(req.user.role == 'ROLE_ADMIN'){
        res.status(200).send({message:"ES ADMIN", user:req.user})
    } else {
        res.status(401).send({message:"NO ES ADMIN", user:req.user})
    }
}

module.exports = {
    initPostUser,
    postUser,
    loginUser,
    deleteUser
}