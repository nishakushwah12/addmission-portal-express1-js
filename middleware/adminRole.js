const jwt = require('jsonwebtoken')


const authRoles = (roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            req.flash('error', 'Unauthorised user please login')
            res.redirect('/')
        }
        next();
    }
}
module.exports = authRoles