const mongoose =require('mongoose')
//User 
const TeacherSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    

},{timestamps:true})

const TeacherModel = mongoose.model('teacher',TeacherSchema)

module.exports = TeacherModel

