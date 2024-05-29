const dotenv= require('dotenv').config();
const configObject= require("./config/config.js")
//Acá hacemos la conexión con MONGODB: 

//1) Instalamos mongoose: npm i mongoose. 
const mongoose = require("mongoose");

//2) Crear una conexión con la base de datos

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log(`Conexion exitosa a la base de datos`))
    .catch((error) => console.log("Error en la conexion :"+error))