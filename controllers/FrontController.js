const UserModel = require('../models/user');
// nodemailer require
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");
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
            res.render('login', { message: req.flash('error'), msg: req.flash('sucess') })
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
            if (OldPassword && NewPassword && ConfirmPassword) {
                const user = await UserModel.findById(id)
                const ismatch = await bcrypt.compare(OldPassword, user.password)

                if (!ismatch) {
                    req.flash('error', 'Current password does not matches')
                    res.redirect('/profile')


                } else {
                    if (NewPassword != ConfirmPassword) {
                        req.flash('error', 'Password does not match ')
                        res.redirect('/profile')

                    } else {

                        const newHashPassword = await bcrypt.hash(NewPassword, 10)
                        await UserModel.findByIdAndUpdate(id, {
                            password: newHashPassword
                        })
                        req.flash('success', 'Password Updated successfully ')
                        res.redirect('/')


                    }
                }

            } else {
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
                        const userData = await result.save()
                        if (userData) {
                            const token = jwt.sign({ ID: userData._id }, 'nisha@12345');
                            // console.log(token);
                            res.cookie('token', token)
                            this.sendVerifyMail(n, e, userData._id)
                            req.flash('success', 'Your Registraion has beeb successfullly.please Login')

                            res.redirect('/register')

                        } else {
                            req.flash('error', 'Not a Verifyed User.')
                            res.redirect('/register')

                        }
                        // req.flash('success', 'Register successfully please login')
                        // res.redirect('/')

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
    //verifyEmail
    static sendVerifyMail = async (n, e, user_id) => {
        // console.log(name,email,status,comment)
        // connenct with the smtp server

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
            to: e, // list of receivers
            subject: "FOr Verification mail", // Subject line
            text: "heelo", // plain text body
            html:
                "<p>Hii " +
                n +
                ',Please click here to <a href="http://localhost:5000/verify?id=' +
                user_id +
                '">Verify</a>Your mail.',
        });
    };

    static verify = async (req, res) => {
        try {
            const updateinfo = await UserModel.findByIdAndUpdate(req.query.id, {
                is_verified: 1,
            });
            if (updateinfo) {
                res.redirect('/Dashboard')
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
                        if (User.role == 'admin' && User.is_verified ==1) {
                            const token = jwt.sign({ ID: User._id }, 'nisha@12345');
                            //console.log(token);
                            res.cookie('token', token)
                            res.redirect('/admin/dashboard')

                        }
                        if (User.role == 'User' && User.is_verified ==1) {
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
    //forgetpassword
    static forgotPasswordVerify = async (req, res) => {
        try {
            const { email } = req.body;
            const userData = await UserModel.findOne({ email: email });
            //console.log(userData)
            if (userData) {
                const randomString = randomstring.generate();
                await UserModel.updateOne(
                    { email: email },
                    { $set: { token: randomString } }
                );
                this.sendEmail(userData.name, userData.email, randomString);
                req.flash("success", "Plz Check Your mail to reset Your Password!");
                res.redirect("/");
            } else {
                req.flash("error", "You are not a registered Email");
                res.redirect("/");
            }
        } catch (error) {
            console.log(error);
        }
    };

    //resetpassword
    static reset_Password = async (req, res) => {
        try {
            const token = req.query.token;
            const tokenData = await UserModel.findOne({ token: token });
            if (tokenData) {
                res.render("reset-password", { user_id: tokenData._id });
            } else {
                res.render("404");
            }
        } catch (error) {
            console.log(error);
        }
    };


    static reset_Password1 = async (req, res) => {
        try {
            const { password, user_id } = req.body;
            const newHashPassword = await bcrypt.hash(password, 10);
            await UserModel.findByIdAndUpdate(user_id, {
                password: newHashPassword,
                token: "",
            });
            req.flash("success", "Reset Password Updated successfully ");
            res.redirect("/");
        } catch (error) {
            console.log(error);
        }
    };
    //   send email
    static sendEmail = async (name, email, token) => {
        // console.log(name,email,status,comment)
        // connenct with the smtp server

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
            subject: "Reset Password", // Subject line
            text: "heelo", // plain text body
            html:
                "<p>Hii " +
                name +
                ',Please click here to <a href="http://localhost:5000/reset-password?token=' +
                token +
                '">Reset</a>Your Password.',
        });
    };



}
module.exports = FrontController