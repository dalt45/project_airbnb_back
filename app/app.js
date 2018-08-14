const express = require('express');
const users = require('./routes/users')
const app = express();
const cors = require("cors")
const bodyParser = require('body-parser');
const morgan = require ('morgan')


const PORT = process.env.PORT;
app.use(cors())
app.use(morgan('combined'));
app.use(bodyParser.json());

app.use('/users', users);

app.get('/', (_req,res) => {
    res.send('Backend airbnb');
});

app.listen(PORT, () => {
    console.log('Estoy corriendo en el puerto', PORT);
})