const mongoose = require("mongoose");
// const dotenv= require('dotenv').config();
const configObject= require("./config/config.js")
//Acá hacemos la conexión con MONGODB: 


//Crear una conexión con la base de datos
mongoose.connect(configObject.mongo_url)
    .then(() => console.log(`Conexion exitosa a la base de datos`))
    .catch((error) => console.log("Error en la conexion :"+error))