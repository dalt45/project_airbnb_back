const mongoose = require('mongoose');

mongoose.connect('mongodb://db:27017/Users');

module.exports = mongoose;