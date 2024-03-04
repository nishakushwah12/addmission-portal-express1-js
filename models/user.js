const mongoose = require('mongoose')
//field

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
  
    role:{
        type:String,
        default:'User'
    },
    token:{
      type:String
  },
  is_verified:{
      type:Number,
      default:0
  },
  
    image: {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },

       
      }


},{timestamps:true})

//model
const UserModel =mongoose.model('User',UserSchema)
module.exports = UserModel