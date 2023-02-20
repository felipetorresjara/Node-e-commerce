const { response } = require("express");
const Category = require('../models/category')
const categoriesPerPage = 10;

const createCategory = async (req, res = response) => {
    const name = req.body.name.toUpperCase();
    const categoryDB = await Category.findOne({name});
    console.log(categoryDB)
    if(categoryDB !== null){
        return res.status(400).json({
            "message": "category already exists"
        })
    }

    const data = {
        name,
        user: req.user._id
    }

    const category = new Category(data);
    await category.save();
    return res.status(201).json({
        "message": "ok"
    })
}

const getCategories = async (req, res = response) => {
    const { page = 1 } = req.query;
    
    const [total, categories] = await Promise.all([
        Category.countDocuments({state: true}),
        Category.find({state: true})
        .populate('user', 'name')
        .skip((Number(page)-1)*categoriesPerPage)
        .limit(categoriesPerPage)
    ])

    res.json({"total": total, "categories": categories});
}

const getCategory = async (req, res = response) => {
    const {id} = req.params;

    const category = await Category.findById(id)
    res.json(category)
}

const updateCategory = async (req, res = response) => {
    const {id} = req.params;
    const {state, user, name} = req.body;
    const data = {
        name: name.toUpperCase(),
        user: req.user.id
    }

    await Category.findByIdAndUpdate(id, data)
    
    res.json({"messaged": "updated"})
}

const deleteCategory = async(req, res = response) => {
    const {id} = req.params;

    const category = await Category.findByIdAndUpdate(id, {state: false}, {new: true});

    return res.status(200).json(category);
}

module.exports = {
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory
}