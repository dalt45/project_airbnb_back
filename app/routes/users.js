const express = require('express');
const params = require('strong-params');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Users = require('../db/models/users')
const SALT = parseInt(process.env.SALT);
const router = express.Router();
router.use(params.expressMiddleware());


router.post('/signup', (req,res) => {
    const params = req.parameters;
    console.log(params);
    let userParams = params.require('user').permit('email','password').value();
   
    const validateEmail = (email) => {
        var re = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
        return re.test(email);
    }

    const checkEmailUniqueness = (email) => {
        Users.countDocuments({"email": email},(err,answer) => {
            if (answer > 0 ){
                console.log(answer)
                console.log("Email Duplicate")
                res.send("Email Duplicado")
            }else{
                bcrypt.hash(userParams.password,SALT,(err, hash) =>{
                    //userParams.ifValidPass = isOkPass(userParams.password)
                    userParams.password = hash;
                    //userParams.ifValidEmail = validateEmail(userParams.email)
                    const user = new Users(userParams)
                    user.save().then((createdUser) => {
                        const token = jwt.sign(createdUser.toJSON(), 'devfrules')
                        res.send({token:token});
                        // o {token}
                    })
                    })
            }
        })
    }

    const isOkPass = (pass) => {
        const anUpperCase = /[A-Z]/;
        const aLowerCase = /[a-z]/; 
        const aNumber = /[0-9]/;
        const aSpecial = /[!|@|#|$|%|^|&|*|(|)|-|_]/;
        const obj = {};
        obj.result = true;
    
        if(pass.length < 8){
            obj.result=false;
            obj.error="Not long enough!"
            return obj;
        }
    
        let numUpper = 0;
        let numLower = 0;
        let numNums = 0;
        let numSpecials = 0;

        for(var i=0; i<pass.length; i++){
            if(anUpperCase.test(pass[i]))
                numUpper++;
            else if(aNumber.test(pass[i]))
                numNums++;
            else if(aSpecial.test(pass[i]))
                numSpecials++;
        }
    
        if(numUpper < 1 || numNums < 1 || aSpecial < 1){
            obj.result=false;
            obj.error="Wrong Format!";
            return obj;
        }
        return obj;
    }
    checkEmailUniqueness(userParams.email);
});

router.post('/login',(req,res) => {
    const params = req.parameters;
    
    let userParams = params.require('user').permit('email','password').value();
    Users.findOne({
        email:userParams.email
    }, (error,user)=> {
        if(error) return res.send(error);
        bcrypt.compare(userParams.password, user.password, (err,response) => {
            if (response) {
                const token = jwt.sign(user.toJSON(), 'devfrules')
                res.send({token});
                //userParams trae la contraseña en texto plano
            }else{            
            res.send("El email o la contraseña son incorrectos");
            }
        })
    } )
})

module.exports = router;