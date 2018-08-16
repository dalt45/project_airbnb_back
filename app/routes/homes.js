const express = require('express');
const params = require('strong-params');
const Homes = require('../db/models/homes')
const SALT = parseInt(process.env.SALT);
const router = express.Router();

router.use(params.expressMiddleware());

router.post('/', (req,res) => {
    console.log(req.user)
    const params = req.parameters;
    let homeParams = params.require('home').permit('title', 'address', 'capacity', 'lat', 'long', 'type', 'price', 'description', 'services', 'beds','city').value();
    homeParams.user_id = req.user.id;
    const home = new Homes(homeParams);
    home.save().then((createdHome) => {
        res.status(200).json({home: createdHome})
    })
})

router.get('/search', (req,res) =>{
    const params = req.query;
    console.log(params);
    Homes.find(params,(err,homes) => {
        res.send({homes})
    })
})


router.get('/:city', (req,res) =>{
    const city = req.params.city;
    Homes.find({
        city:city
    }, (err, homes) => {
        res.send({homes:homes})
    })
})



module.exports = router;