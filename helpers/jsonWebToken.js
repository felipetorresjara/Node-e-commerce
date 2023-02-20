const { response } = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const createJWT = (uid='') =>{
    return new Promise((resolve, reject)=>{
        const payload = {uid};
        jwt.sign(payload, process.env.JWTKEY,{
            expiresIn: '4h'
        },(err, token) => {
            if(err){
                reject('error generating token');
            }else{
                resolve(token);
            }
        });
    })
}

const validateJWT = async(req, res = response, next) =>{
    let isAnError = false;
    const token = req.header('Authorization');
    if(!token){
        isAnError = true;
    }
    try{
        const {uid} = jwt.verify(token, process.env.JWTKEY);
        const user = await User.findById(uid);
        if(!user || !user.state){
            isAnError = true
        }
        req.user = user;
        req.uid = uid;

    }catch(err){
        return res.status(401).json({
            "message": "unauthorized user"
        });
    }
    if(isAnError){
        return res.status(401).json({
            "message": "unauthorized user"
        });
    }

    next();
}

module.exports = {
    createJWT,
    validateJWT
}