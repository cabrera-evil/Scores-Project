const mongoose = require("mongoose");

// Connecting to Mongo Atlas database
const connect = async () => {
    mongoose
        .set('strictQuery', false)
        .connect(process.env.MONGODB_CNN)
        .then(() => { 
            console.log("Connected to MongoDB Atlas") 
        })
        .catch((err) => { console.log(err) });
};

module.exports = { connect };