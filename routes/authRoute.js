const express = require('express');
const router = express.Router();

router.use(express.json());

const bodyparser = require('body-parser');
router.use(bodyparser.json());
router.use(bodyparser.urlencoded({extended: true}));



const userController = require('../controllers/userController');

router.get('/mail-verification', userController.mailVerification);

router.get('/reset-password', userController.resetPassword);
router.post('/reset-password', userController.updatePassword);
router.post('/reset-password', userController.resetSuccess);


module.exports = router;