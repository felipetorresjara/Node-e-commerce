const { response } = require("express");
const Product = require('../models/product')
const productsPerPage = 24;

const createProduct = async (req, res = response) => {
    const {state, user, ...body} = req.body;
    body.name = body.name.toUpperCase();
    const productDB = await Product.findOne({name: body.name});
    if(productDB !== null){
        return res.status(400).json({
            "message": "product already exists"
        })
    }

    const data = {
        ...body,
        user: req.user._id
    }

    const newProduct = new Product(data);
    await newProduct.save();
    return res.status(201).json({
        "message": "ok",
        "product": newProduct
    })
}

const getProducts = async (req, res = response) => {
    const { page = 1, search = '' } = req.query;
    
    const regex = new RegExp(search, 'i');
    const [total, products] = await Promise.all([
        Product.countDocuments({name: regex}),
        Product.find({name: regex})
        .skip((Number(page)-1)*productsPerPage)
        .limit(productsPerPage)
    ])
    const total_pages = total < productsPerPage ? 1 : Math.ceil(total/productsPerPage);
    res.json({"total": total, total_pages: total_pages, page: Number(page), "products": products});
}

const getProduct = async (req, res = response) => {
    const {id} = req.params;

    const product = await Product.findOne({product_id: id});
    res.json(product)
}

const updateProduct = async (req, res = response) => {
    const {id} = req.params;
    const {state, user, ...updatedInfo} = req.body;
    if(updatedInfo.name){
        updatedInfo.name = updatedInfo.name.toUpperCase();
    }
    updatedInfo.user = req.user.id;

    await Product.findByIdAndUpdate(id, updatedInfo);
    
    res.json({"messaged": "updated"})
}

const deleteProduct = async(req, res = response) => {
    const {id} = req.params;

    const product = await Product.findByIdAndUpdate(id, {state: false}, {new: true});

    return res.status(200).json(product);
}

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
}