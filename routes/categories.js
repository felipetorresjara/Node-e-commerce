const { Router } = require('express');
const { check } = require('express-validator');
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/categories');
const { categoryValidator } = require('../helpers/dbValidators');
const { validateJWT } = require('../helpers/jsonWebToken');
const { isAdmin } = require('../middlewares/roleMiddleware');
const { validParams } = require('../middlewares/validParams');

const router = Router();

router.get('/', getCategories);

//get category with id
router.get('/:id',[
    check('id', 'Invalid id').isMongoId(),
    check('id').custom(categoryValidator),
    validParams
],getCategory);

//create category
router.post('/',[
    validateJWT,
    check('name', 'Name is required').not().isEmpty(),
    validParams
], createCategory);

//update category
router.put('/:id', [
    validateJWT,
    check('name', 'name is required').not().isEmpty(),
    validParams
], updateCategory);

//delete category
router.delete('/:id',[
    validateJWT,
    isAdmin,
    check('id', 'invalid id').isMongoId(),
    check('id').custom(categoryValidator),
    validParams
], deleteCategory);

module.exports = router;