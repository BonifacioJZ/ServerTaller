'use strict'

const mongoose = require('mongoose')
const Shema = mongoose.Schema

const PersonajeShema = Shema({
    name:String,
    alias:String,
    informacion:String,
    imagen:String,
    saga:String
})

module.exports = mongoose.model('Personaje',PersonajeShema)