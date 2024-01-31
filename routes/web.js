const express = require('express')
const FrontController = require('../controllers/FrontController')
const route = express.Router()
const checkUserAuth = require('../middleware/auth')
const CourseController = require('../controllers/CourseController')
const AdminController = require('../controllers/AdminController')


//route path
route.get('/', FrontController.Login)
route.get('/Register', FrontController.Register)
route.get('/Dashboard', checkUserAuth, FrontController.dashboard)


route.get('/contact', checkUserAuth, FrontController.Contact)
route.get('/Team', FrontController.Team)

route.get('/About', checkUserAuth, FrontController.About)
route.post('/insertreg', FrontController.insertreg)
route.post('/verifyLogin', FrontController.verifyLogin)
route.get('/logout', FrontController.logout)
route.get('/profile', checkUserAuth, FrontController.profile)
route.post('/updateProfile', checkUserAuth, FrontController.updateProfile)
route.post('/changePassword', checkUserAuth, FrontController.changePassword)


//course controller
route.post('/btechFormInsert', checkUserAuth, CourseController.btechFormInsert)
route.get('/courseDisplay', checkUserAuth, CourseController.courseDisplay)
route.get('/courseView/:id', checkUserAuth, CourseController.courseView)
route.get('/courseEdit/:id', checkUserAuth, CourseController.courseEdit)

route.get('/courseDelete/:id', checkUserAuth, CourseController.courseDelete)

route.post('/courseUpdate/:id', checkUserAuth, CourseController.courseUpdate)

// admin controller
route.get('/admin/dashboard', checkUserAuth, AdminController.getUserDisplay)

route.post('/update_status/:id', checkUserAuth, AdminController.updateStatus)






module.exports = route
