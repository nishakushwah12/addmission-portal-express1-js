const mongoose = require('mongoose');
const liveDb ='mongodb+srv://nishakushwah374:bettu2024@cluster0.eu5wd4i.mongodb.net/addmission1?retryWrites=true&w=majority'
const localDb ='mongodb://127.0.0.1:27017/addmission1'
const connectDb= ()=>{
    return mongoose.connect(liveDb)
    .then(()=>{
        console.log("connected sucessfully");
    }).catch((err)=>{
        console.log(err);
    })
}

module.exports = connectDb