'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')
const app = express()
const Personaje = require('./models/personaje')
const port = process.env.PORT || 8080

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use((req, res, next) => {
    //en vez de * se puede definir SÓLO los orígenes que permitimos
    res.header('Access-Control-Allow-Origin', '*');
    //metodos http permitidos para CORS
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();

})

app.post('/api/personaje',(req,res)=>{
    console.log(req.body)
    let personaje = new Personaje({
        name:req.body.name,
        alias:req.body.alias,
        informacion:req.body.informacion,
        imagen:req.body.imagen,
        saga:req.body.saga
    })
    personaje.save((err,personajeStored)=>{
        if(err) res.status(500).send({message:`Error al salvar la informacion del personaje ${err}`})
        res.status(200).send({personaje:personajeStored})
    })
})
app.get('/api/personaje',(req,res)=>{
    Personaje.find({},(err,personajes)=>{
        if(err) return res.status(500).send({message:`Error al mostrar los personajes ${err}`})
        if(!personajes) return res.status(404).send({message:`nose encontraron personajes`})
        res.status(200).send({personajes})
    })

})
app.get('/api/personaje/:idu',(req,res)=>{
    let personajeID = req.params.idu
    Personaje.findById(personajeID,(err,personaje)=>{
        if (err) return res.status(500).send({ message: `Error al mostrar los personajes ${err}` })
        if (!personaje) return res.status(404).send({ message: `nose encontraron personajes` })
        res.status(200).send({ personaje })
    })
})
//eliminar personaje
app.delete('/api/personaje/:idu',(req,res)=>{
    let personajeId = req.params.idu
    Personaje.findById(personajeId,(err,personaje)=>{
        if(err) return res.status(500).send({message:`Error al eliminar el personaje ${err}`})
        personaje.remove(err=>{
            if (err) return res.status(500).send({ message: `Error al eliminar el personaje ${err}` })
            res.status(200).send({message:`El personaje a sido eliminado`})
        })
    })
})

mongoose.connect('mongodb://localhost/personajes',(err,res)=>{
    if(err) return console.log(`Hay un error de conexion en la base de datos`)
    console.log(`conexion exitosa a la base de datos`)
    app.listen(port, ()=>{
        console.log(`API REST Corriendo en el puerto ${port}`)

    })
})