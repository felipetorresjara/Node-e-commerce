const { response } = require("express");

const isAdmin = (req, res = response, next) => {
    if(!req.user){
        return res.status(500).json({"messsage": 'invalid token'});
    }

    const {role} = req.user;
    console.log(role)
    if(role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            "message": "the user does not have the necessary permissions"
        });
    }
    next();
}

const hasRole = (...roles) => {
    return (req, res = response, next) => {
        if(!roles.includes(req.user.role)){
            return res.status(401).json({
                "message": "the user does not have the necessary permissions"
            });
        }
        next();
    }
}

module.exports = {
    isAdmin,
    hasRole
}