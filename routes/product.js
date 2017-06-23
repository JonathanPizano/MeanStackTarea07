'use strict';

var express = require('express');
var UserController = require('../controllers/user')
var ProductController = require('../controllers/product')

var api = express.Router();
var md_auth = require('../middlewares/authenticated')
var md_user = require('../middlewares/user')
var md_prod = require('../middlewares/product')

api.post('/product/register',
                md_auth.ensureAuth,
                md_prod.productValidation,
                md_prod.verifyAdminUser,
                ProductController.postProduct);

api.put('/product/update/:productId?',
                md_auth.ensureAuth,
                md_prod.productValidation,
                md_prod.productIdValidation,
                md_prod.findProductById,
                md_prod.verifyAdminUser,
                ProductController.updateProduct);

api.delete('/product/delete/:productId?',
                md_auth.ensureAuth,
                md_prod.productIdValidation,
                md_prod.findProductById,
                md_prod.verifyAdminUser,
                ProductController.deleteProduct);

api.get('/product/:productId?',
                md_prod.productIdValidation,
                md_prod.findProductById,
                ProductController.showProduct);

api.get('/products',
                md_prod.findAll,
                ProductController.showAll);

module.exports = api;