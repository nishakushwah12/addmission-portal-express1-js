const CourseModel = require('../models/course')
const nodemailer = require('nodemailer')
class CourseController {


  static btechFormInsert = async (req, res) => {
    try {
      //  console.log(req.body);
      const { name, email, phone, city, address, course } = req.body
      const result = new CourseModel({
        name: name,
        email: email,
        phone: phone,
        city: city,
        address: address,
        course: course,
        user_id: req.user.id

      })
      await result.save()
      this.SendMail(name, email)
      res.redirect('/courseDisplay')
    } catch (error) {
      console.log(error);

    }
  }
  static courseDisplay = async (req, res) => {
    try {

      const { name, id, image } = req.user
      const data = await CourseModel.find({ user_id: id })
      //console.log(data);
      res.render('course/courseDisplay', { n: name, d: data,i:image, message:req.flash('success') })
    } catch (error) {
      console.log(error);

    }
  }

  static courseView = async (req, res) => {
    try {
     // console.log(req.params.id);
     const { name, id, image } = req.user

     const view = await CourseModel.findById(req.params.id)
     //console.log(view);
     res.render('course/courseView',{courseview:view, n:name, i:image})
    } catch (error) {
      console.log(error);

    }
  }

  static courseEdit = async (req, res) => {
    try {
      //console.log(req.params.id);
      const {name, id, image}= req.user
      const edit= await CourseModel.findById(req.params.id)
      //console.log(edit);
      res.render('course/courseEdit',{courseedit:edit, n:name, i:image})


    } catch (error) {
      console.log(error);

    }
  }
  static courseUpdate = async (req, res) => {
    try {
      //console.log(req.params.id);
      const { id}= req.user
      const { name, email, phone, city, address, course } = req.body

      const edit= await CourseModel.findByIdAndUpdate(req.params.id , {
        name: name,
        email: email,
        phone: phone,
        city: city,
        address: address,
        course: course,
        user_id: req.user.id

      })
      
      req.flash('success','course updated successfully')
      
      res.redirect('/courseDisplay')


      //console.log(edit);

    } catch (error) {
      console.log(error);
    }
  }
  static courseDelete = async (req, res) => {
    try {
      //console.log(req.params.id);
      await  CourseModel.findByIdAndDelete(req.params.id)
      req.flash('success','course delete successfully')
      
        

res.redirect('/courseDisplay')
    } catch (error) {
      console.log(error);

    }
  }
  static SendMail = async (name, email) =>{
    //console.log(name, email)
    let transporter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,

      auth: {
        user: "nishakushwah374@gmail.com",
        pass: "cvwnetuasnhzotfo",
      },
    });
let info = await transporter.sendMail({
      from: "test@gmail.com", // sender address
      to: email, // list of receivers
      subject: "Course created successfully", // Subject line
      text: "heelo", // plain text body
      html: `<b>${name}</b> course insert please wait  successful! `, // html body
    });
    //console.log("Messge sent: %s", info.messageId);
  };

  
 
  


}

module.exports = CourseController