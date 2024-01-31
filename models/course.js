const mongoose = require('mongoose')

// user Schema 
const CourseSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    course: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'Panding'
    },
    comment: {
        type: String
    },

    user_id:{
        type:String,
        Required:true
    },
    



}, { timestamps: true })

const CourseModel = mongoose.model('course', CourseSchema)

module.exports = CourseModel