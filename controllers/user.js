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

    // Si el rol es ADMIN se puede proceder a la siguiente verificacion
    if(req.user.role == 'ROLE_ADMIN'){
        // Si el usuario que se desea borrar es USER se procede a borrar
        if(req.userObj[0].role == 'ROLE_USER'){
            User.findByIdAndRemove(req.userObj[0]._id).exec()
            .then((deletedUser) => {
                if(deletedUser) {
                    res.status(200).send({deletedUser: deletedUser});
                } else {
                    console.log(req.userObj[0]._id)
                    console.log(deletedUser)
                    res.status(200).send({message: 'Querido Administrador el usuario con el ID ' + req.userObj._id + ' no existe en BD'});
                }
            })                        
        } else {
            //Hay que verificar que el admin sólo se borre a si mismo
            if(req.user.sub == req.userObj[0]._id){
                // Si el usuario desea borrarse a si mismo lo puede hacer
                User.findByIdAndRemove(req.userObj[0]._id).exec()
                .then((deletedUser) => {
                    if(deletedUser) {
                        res.status(200).send({deletedUser: deletedUser});
                    } else {
                        console.log(req.userObj[0]._id)
                        console.log(deletedUser)
                        res.status(200).send({message: 'El administrador con el ID ' + req.userObj._id + ' no existe en BD'});
                    }
                })                  
            } else {
                //No se puede borrar a otro administrador
                res.status(409).send({message:"No se puede borrar a otro admin"})
            }
        }
    } else {
        //Se niega el permiso de borrar a otro usuario si no se es admin
        res.status(401).send({message:"NO ES ADMIN", user:req.user})
    }
}

function showUser(req, res){
    // Si el usuario es un administrador , se muestra la informacion requerida
    if(req.user.role == 'ROLE_ADMIN'){
        //Show all user info
        res.status(200).send({User: req.userObj[0]})
    } else {
        //Se verifica que la informacion
        //requerida sea sobre sí mismo 
        if(req.user.sub == req.userObj[0]._id){
            //Se muestra la informacion de sí mismo
            res.status(200).send({User: req.userObj[0]})
        }else{
            //No se puede mostrar la informacion de otros usuarios 
            res.status(401).send({message:"No se puede mostrar la informacion de otros usuarios"})
        }
    }
}

function showAll(req, res){
    // Si el usuario es un administrador , se muestra la informacion requerida
    if(req.user.role == 'ROLE_ADMIN'){
        // Mostrar informacion
        res.status(200).send({Usuarios: req.userObj})        
    } else {
        // Mostrar solo nombres
        var nombres = []
        /*req.userObj.forEach((usuario)=>{
            nombres = usuario.username
       })*/
       for(var i = 0; i < req.userObj.length; i++){
           nombres[i] = req.userObj[i].username
       }
       res.status(200).send({usuarios:nombres})
    }
}

module.exports = {
    initPostUser,
    postUser,
    loginUser,
    deleteUser,
    showUser,
    showAll
}