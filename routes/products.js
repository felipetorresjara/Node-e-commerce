const { Router } = require('express');
const { check } = require('express-validator');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('../controllers/product');
const { validParams } = require('../middlewares/validParams');
const { validateJWT } = require('../helpers/jsonWebToken');
const { productValidator, categoryValidator } = require('../helpers/dbValidators');

const router = Router();

//get products with pagination
router.get('/', getProducts);

//get products with id
router.get('/:id',[
    check('id', 'Product_id is required').not().isEmpty(),
    check('id').custom(productValidator),
    validParams
],getProduct);

//create product
router.post('/',[
    validateJWT,
    check('product_id', 'Product_id is required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('category', 'invalid category id').isMongoId(),
    check('category').custom(categoryValidator),
    validParams
], createProduct);

//update product
router.put('/:id', [
    validateJWT,
    check('id', 'Product_id is required').not().isEmpty(),
    check('id').custom(productValidator),
    check('name', 'name is required').not().isEmpty(),
    check('category', 'invalid category id').isMongoId(),
    check('category').custom(categoryValidator),
    validParams
], updateProduct);

//delete product
router.delete('/:id',[
    validateJWT,
    check('id', 'Product_id is required').not().isEmpty(),
    check('id').custom(productValidator),
    validParams
], deleteProduct);

module.exports = router;