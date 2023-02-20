const { Router } = require('express');
const { check } = require('express-validator');
const { usersGet, usersPost, usersPut, usersDelete } = require('../controllers/users');
const {roleValidator, emailValidator, userAlreadyExists} = require('../helpers/dbValidators');
const { validateJWT } = require('../helpers/jsonWebToken');
const {hasRole} = require('../middlewares/roleMiddleware');
const { validParams } = require('../middlewares/validParams');

const router = Router();

router.get('/',[
], usersGet)

router.post('/',[
    check('name', 'name param is required').not().isEmpty(),
    check('password', 'password param is required').not().isEmpty(),
    check('email', 'email param is required').not().isEmpty(),
    check('email', 'invalid email').isEmail(),
    check('email').custom(emailValidator),
    check('role').custom(roleValidator),
    validParams
], usersPost)

router.put('/:id',[
    check('id', 'invalid ID').isMongoId(),
    check('id').custom(userAlreadyExists),
    check('role').custom(roleValidator),
    validParams
], usersPut)

router.delete('/:id',[
    validateJWT,
    hasRole('ADMIN_ROLE', 'USER_ROLE'),
    check('id', 'invalid ID').isMongoId(),
    check('id').custom(userAlreadyExists),
    validParams
], usersDelete)

module.exports = router;