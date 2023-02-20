const { response } = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const usersPerPage = 10;
const usersGet = async (req, res = response) => {
    const { page = 1 } = req.query;
    
    const [total, users] = await Promise.all([
        User.countDocuments({state: true}),
        User.find({state: true})
        .skip((Number(page)-1)*usersPerPage)
        .limit(usersPerPage)
    ])

    res.json({"total": total, "users": users});
}

const usersPost = async (req, res = response) => {

    const { name, email, password, role } = req.body;

    const user = new User({ name, email, password, role});
    //encrypt password
    const salt = bcryptjs.genSaltSync(10);
    user.password = bcryptjs.hashSync(password, salt);
    //save user in db
    await user.save();
    res.status(201).json(user);
}

const usersPut = async (req, res = response) => {
    const {id} = req.params;
    const {_id, password, google, email, ...userInfo} = req.body;
    if(password){
        const salt = bcryptjs.genSaltSync(10);
        userInfo.password = bcryptjs.hashSync(password, salt);
    }
    const user = await User.findByIdAndUpdate( id, userInfo)
    res.json({'message': "put controller", "user": user});
}

const usersDelete = async (req, res = response) => {
    const {id} = req.params;
    const uid = req.uid;
    //delete db: const user = await User.findByIdAndDelete( id );
    //logical delete
    const user = await User.findByIdAndUpdate(id, {state: false});
    const authUser = req.user;
    res.json({'message': 'user delete', 'user': user, 'authUser': authUser});
}

module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersDelete
}