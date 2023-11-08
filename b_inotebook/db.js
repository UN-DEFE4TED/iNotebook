const mongoose = require('mongoose');

const mongoURI = process.env.DB_CONN_STR;

const connectToMongo = async ()=>{
    try {
        await mongoose.connect(mongoURI+'/inote')
        console.log('connected to mongo successfully...');
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = connectToMongo;