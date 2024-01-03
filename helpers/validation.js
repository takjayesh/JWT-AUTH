const {check} =  require('express-validator');

exports.registerValidator = [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please inculde email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('mobile','MObile number sgould contain 10 didgigts').not().isEmpty().isLength({
        min: 10,
        max: 10
    }),
    check('password','Password must be greater than 6 characters').not().isEmpty().isLength({
        min: 6
    }).isStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
    }),

    check('image').custom(
        (value, {req}) =>{
            if(req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/png' || req.file.mimetype == 'image/jpg'){
                return true;
        }else{
            return false;
        }
    }  
    ).withMessage('Please upload and image with jpg/jpeg'),
];

exports.sendMailVerificationValidator = [
    check('email', 'Please inculde email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),

];

exports.passwordResetValidator = [
    check('email', 'Please inculde email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),

];

exports.loginValidator = [
    check('email', 'Please inculde email').isEmail().normalizeEmail({
        gmail_remove_dots: true
    }),
    check('password','password is required').not().isEmpty(),
];