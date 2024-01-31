const CourseModel = require('../models/course')
const nodemailer = require('nodemailer')
class AdminController {
    static getUserDisplay = async (req, res) => {
        try {

            const { name, image } = req.user
            const course = await CourseModel.find()
            res.render('admin/getUserDisplay', { n: name, i: image, c: course })

        } catch (error) {
            console.log('error');

        }
    }
    static updateStatus = async (req, res) => {
        try {
            const { comment, name, email, status } = req.body
            await CourseModel.findByIdAndUpdate(req.params.id, {
                comment: comment,
                status: status
            })
            this. SendMail(name, email, status, comment)
            res.redirect('/admin/dashboard')
        } catch (error) {
            console.log(error);

        }
    }
    static SendMail = async (name, email, status, comment) => {
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
            subject: ` Course ${status}`, // Subject line
            text: "heelo", // plain text body
            html: `<b>${name}</b> Course  <b>${status}</b> successful! <br>
             <b>Comment from Admin</b> ${comment} `, // html body
        });
        //console.log("Messge sent: %s", info.messageId);
    };
}
module.exports = AdminController