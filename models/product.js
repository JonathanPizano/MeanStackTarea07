'use strict'

var mongoose = require('mongoose')
require('mongoose-double')(mongoose);
var Schema = mongoose.Schema;
var SchemaTypes = mongoose.Schema.Types;

var ProductSchema = new Schema({
    name:{
        type:String,
        trim: true,
        required: 'Inserta un nombre por favor',
        index:{
            unique: false,
            dropDups: true
        }        
    },
    codebar:{
        type:String,
        trim: true,
        required: 'Inserta un nombre por favor',
        index:{
            unique: true,
            dropDups: true
        }
    },
    cost:{
        type:SchemaTypes.Double,
        trim: true,        
        required: 'Inserta un costo por favor',
        index:{
            unique: false,
            dropDups: true
        }         
    },
    active:{
        type:Boolean,
        trim: true,        
        default: 'true',
        index:{
            unique: false,
            dropDups: true
        } 
    },
    brand:{
        type:String,
        trim: true,
        required: 'Inserta una marca por favor',
        index:{
            unique: false,
            dropDups: true
        }
    }
},{
    timestamps: true
});

var Product = mongoose.model('Product', ProductSchema);
module.exports = Product;