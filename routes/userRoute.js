const express = require('express');
const router = express.Router();

router.use(express.json());

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg'){
            cb(null, path.join(__dirname, '../public/images'));
        }
    },
    filename: (req, file, cb) => {
        const name = Date.now() + path.extname(file.originalname);
        cb(null, name)
    }
})

const fileFilter = (req, file, cb) => {
    if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

const upload = multer({ 
               storage : storage,
               fileFilter : fileFilter
                });

const userController = require('../controllers/userController');
const {registerValidator, sendMailVerificationValidator, passwordResetValidator}  =require('../helpers/validation');

router.post('/register', upload.single('image'), registerValidator , userController.userRegister);

router.post('/send-mail-verification',sendMailVerificationValidator, userController.sendMailVerification);

router.post('/forgot-password', passwordResetValidator, userController.forgotPassword);



module.exports = router;