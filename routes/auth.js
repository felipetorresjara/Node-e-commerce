const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validParams } = require('../middlewares/validParams');

const router = Router();

router.post('/login',[
    check('email', 'invalid email').isEmail(),
    check('password', 'password param is required').not().isEmpty(),
    validParams
], login);

router.post('/google',[
    check('id_token', 'invalid token id').not().isEmpty(),
    validParams
], googleSignIn);

module.exports = router;