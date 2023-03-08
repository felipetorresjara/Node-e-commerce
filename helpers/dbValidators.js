const { Category, Product } = require('../models');
const Role = require('../models/role');
const User = require('../models/user');

const roleValidator =  async(role = '') => {
    const validRole = await Role.findOne({role});
    if(!validRole){
        throw new Error(`invalid role: ${role}`);
    }
}

const emailValidator = async(email='') => {
    const checkEmail = await User.findOne({email});
    if(checkEmail){
        throw new Error(`email already used: ${email}`);
    }
}

const userAlreadyExists = async(id) => {
    const user = await User.findById(id);
    if(!user){
        throw new Error('id does not exist');
    }
}

// Check if a category exists
const categoryValidator = async(id) => {
    const category = await Category.findById(id);
    if(!category){
        throw new Error(`invalid id: ${id}`);
    }
}

const productValidator = async(id) => {
    const product = await Product.find({product_id: id});
    if(!product){
        throw new Error(`invalid product: ${id}`);
    }
}

module.exports = {
    roleValidator,
    emailValidator,
    userAlreadyExists,
    categoryValidator,
    productValidator
}