const UserModel = require('../models/user');

const TeacherModel = require('../models/teacher')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const CourseModel = require('../models/course');
//for image on cloundinary
var cloudinary = require('cloudinary').v2;


cloudinary.config({
    cloud_name: 'dk4ulehts',
    api_key: '563452817625954',
    api_secret: 'tMryYl6JihhF7F6vE2RKBwBghzg'
});



class FrontController {

    static Login = async (req, res) => {

        try {
            res.render('login', { message: req.flash('error') })
        } catch (error) {

        }
    }
    static Register = async (req, res) => {

        try {
            res.render('register', { message: req.flash('error') })
        } catch (error) {

        }
    }
    static Contact = async (req, res) => {// static method class ke name se call hote h

        try {
            const { name, image } = req.user
            res.render('contact', { n: name, i: image })
        } catch (error) {

        }
    }
    static dashboard = async (req, res) => {// static method class ke name se call hote h

        try {
            const { name, id, image } = req.user // extract user name
            const btech = await CourseModel.findOne({ user_id: id, course: 'btech' })
            const bca = await CourseModel.findOne({ user_id: id, course: 'bca' })
            const mca = await CourseModel.findOne({ user_id: id, course: 'mca' })

            res.render('dashboard', { n: name, btech: btech, bca: bca, mca: mca, i: image })// show name on view
        } catch (error) {


        }
    }

    static About = async (req, res) => {

        try {
            const { name, image } = req.user
            res.render('about', { n: name, i: image })
        } catch (error) {

        }
    }
    static Team = async (req, res) => {

        try {
            res.send("Team page")
        } catch (error) {

        }
    }
    static profile = async (req, res) => {

        try {
            const { name, image, email } = req.user
            res.render('profile', { n: name, i: image, e: email, message: req.flash('success') })
        } catch (error) {

        }
    }
    static updateProfile = async (req, res) => {
        try {

            // console.log(req.body);
            // console.log(req.files.image)
            const { name, email, image } = req.body
            if (req.files) {
                const userImg = await UserModel.findById(req.user.id)

                const imgId = userImg.image.public_id
                await cloudinary.uploader.destroy(imgId)//for delete image
                const file = req.files.image;
                const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                    folder: 'profile'

                });
                console.log(imageUpload);
                var data = {
                    name: name,
                    email: email,
                    image: {
                        public_id: imageUpload.public_id,
                        url: imageUpload.secure_url
                    }

                }
                // console.log(imgId);
                //  console.log(userImg);


            } else {
                var data = {
                    name: name,
                    email: email,
                }

            }
            await UserModel.findByIdAndUpdate(req.user.id, data)
            req.flash('success', 'Profile Update Successfully')

            res.redirect('/profile')
        } catch (error) {
            console.log(error);

        }
    }
    static changePassword = async (req, res) => {
        try {
          //  console.log(req.body)
            const { OldPassword, NewPassword, ConfirmPassword } = req.body
            const { id } = req.user
            if (OldPassword && NewPassword && ConfirmPassword){
                const  user= await UserModel.findById(id)
                const ismatch= await bcrypt.compare(OldPassword, user.password)
            
                if(!ismatch){
                    req.flash('error', 'Current password does not matches')
                    res.redirect('/profile')
    

                }else{
                    if(NewPassword != ConfirmPassword){
                        req.flash('error', 'Password does not match ')
                        res.redirect('/profile')
          
                    }else{
                
                        const newHashPassword = await bcrypt.hash(NewPassword, 10)
                        await UserModel.findByIdAndUpdate(id, {
                            password: newHashPassword
                        })
                        req.flash('success', 'Password Updated successfully ')
                        res.redirect('/')
                    
                
                    }
                }

            }else{
                req.flash('error', 'ALL fields are required ')
                res.redirect('/profile')

            }
} catch (error) {
            console.log(error);

        }
    }



    // insert data insertreg
    static insertreg = async (req, res) => {

        try {
            //console.log(req.files.image);
            const file = req.files.image
            const imageUpload = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'profile'
            })

            //console.log(imageUpload)


            //console.log(req.body)

            const { n, e, p, cp } = req.body

            const User = await UserModel.findOne({ email: e })
            // console.log(User);
            if (User) {
                req.flash('error', 'Email is already exist')
                res.redirect('/register')//  redirecte me hamesa route ka path lete h webjs se
            }
            else {
                if (n && e && p && cp) {
                    if (p == cp) {
                        const hashpassword = await bcrypt.hash(p, 10)// generate secure password
                        const result = new UserModel({
                            //model view
                            name: n,
                            email: e,
                            password: hashpassword,//p
                            image: {
                                public_id: imageUpload.public_id,
                                url: imageUpload.secure_url
                            }

                        })
                        await result.save()
                        req.flash('error', 'Register successfully please login')
                        res.redirect('/')

                    }
                    else {
                        req.flash('error', 'password and confirm password does not match')
                        res.redirect('/register')


                    }

                }
                else {
                    req.flash('error', 'All field are require')
                    res.redirect('/register')


                }
            }


        } catch (error) {
            console.log(error);

        }
    }

    // verify login data 
    static verifyLogin = async (req, res) => {
        try {
            //console.log(req.body)
            const { email, password } = req.body
            if (email && password) {
                const User = await UserModel.findOne({ email: email })
                //console.log(user)
                if (User != null) {

                    const ismatch = await bcrypt.compare(password, User.password)
                    if (ismatch) {
                        // console.log(user.role)
                        if (User.role == 'admin') {
                            const token = jwt.sign({ ID: User._id }, 'nisha@12345');
                            //console.log(token);
                            res.cookie('token', token)
                            res.redirect('/admin/dashboard')

                        }
                        if (User.role == 'User') {
                            const token = jwt.sign({ ID: User._id }, 'nisha@12345');
                            //console.log(token);
                            res.cookie('token', token)
                            res.redirect('/dashboard')

                        }

                    }
                    else {
                        req.flash('error', 'Email or Password is not valid.')
                        res.redirect('/')
                    }
                }
                else {
                    req.flash('error', 'You are not a registered user.')
                    res.redirect('/')
                }
            }
            else {
                req.flash('error', 'All Fields are required')
                res.redirect('/')
            }
        } catch (error) {

        }
    }

    static logout = async (req, res) => {

        try {
            res.clearCookie('token')
            res.redirect('/')
        } catch (error) {
            console.log(error);

        }
    }
}
module.exports = FrontController