const jwt = require('jsonwebtoken');
const Users = require('../db/models/users');

const auth = (req ,res ,next) => {
    if(req.path === '/users/signup' || req.path === '/users/login' ) return next();
    const token = req.headers.token;
    const decoded = jwt.verify(token,'devfrules');
    Users.findOne({
        email: decoded.email
    },(err,user) => {
        //hacer validación del error
        if (err) return res.send("token erroneo")
        req.user = user;
        return next();
    })
    //headers son metadatos referentes a la petición    

};

module.exports = auth;

