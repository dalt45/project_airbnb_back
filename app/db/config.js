const mongoose = require('mongoose');
const environment = process.env.NODE_ENV || "development";
const config = {
    development: "mongodb://db:27017/Users",
    test: "mongodb://db:27017/test",
    production:process.env.DB_URL
}
//configuraciòn para crera bases de datos para los diferentes ambientes a partir de una variable de entorno
//usaremos chai generar pruebas de test, should (aserciones), supertest generar ambiente de testeo, 
//should-http (aserciones para request)

mongoose.connect(config[environment]);

module.exports = mongoose;