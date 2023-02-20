const { response } = require("express");
const User = require('../models/user')
const bcryptjs = require('bcryptjs');
const { createJWT } = require("../helpers/jsonWebToken");
const { googleVerify } = require("../helpers/googleVerify");

const login = async (req, res = response) => {
    const { email, password } = req.body;
    try {
        //check email in db
        const user = await User.findOne({email});
        console.log("user:", user)
        const validPass = user ? bcryptjs.compareSync(password, user.password) : false;
        if(!user || !user.state || !validPass){
            return res.status(400).json({
                "message": "invalid email or password, try again"
            });
        }

        const token = await createJWT(user.id);
        res.json({user: user, token: token});

    } catch (error){
        console.log(error)
        return res.status(500)
    }
}

const googleSignIn = async (req, res= response) => {
    const { id_token } = req.body;
    try {
        const {name, email, picture} = await googleVerify(id_token);
        let user = await User.findOne({email});
        if(!user){
            const data = {
                name,
                email,
                password: ':P',
                picture,
                role: "USER_ROLE",
                google: true
            }
            user = new User(data);
            await user.save();
        }
        else if(!user.state){
            res.status(401).json({
                "message": 'invalid user'
            })
        }
        // create jwt
        const jwt = await createJWT(user.id);  
        res.json({
            user: user,
            jwt: jwt
        })
    } catch (error){
        console.log(error);
        res.status(400).json({
            "message": 'failed to login'
        })
    }
}

module.exports = {
    login,
    googleSignIn
}