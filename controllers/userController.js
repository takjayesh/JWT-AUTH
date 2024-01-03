const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const {validationResult} =require('express-validator');
const mailer = require('../helpers/mailer');
const randomstring = require('randomstring');
const PasswordReset = require('../models/passwordReset');
const jwt = require('jsonwebtoken');

const userRegister = async (req, res) => {
    try {

        const errors = validationResult(req);

        if(!errors.isEmpty()){
            return res.status(400).json({ 
                success: false,
                msg: 'Errors',
                errors: errors.array()
             });
        }

        const { name, email, mobile, password } = req.body;

        const isExists = await User.findOne({email});
        console.log(isExists);

        if(isExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashPassword = await bcrypt.hash(password,10);
        const user = new User({
            name,
            email,
            mobile,
            password: hashPassword,
            image:'images/'+ req.file.filename
        });

        const userData = await user.save();

        // save() is a method provided by mongoose to save data to mongodb
        const msg = `<p> hiii, ${name} please verify your <a href = "http://127.0.0.1:3000/mail-verification?id=${userData._id}">click herre</a>  </p>`;

        await mailer.sendMail(email, 'Email Verification', msg);

       return res.status(201).json({ success: true,
             data: userData,
             message: 'User created successfully'
             });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

const mailVerification = async (req, res) => {
    try{

        if(req.query.id == undefined){
            return res.render('404');
        }
        
    const userData = await User.findOne({_id: req.query.id});
    
    if(userData){
    
        if(userData.is_verified == 1){
            return res.render('mail-verification', { message: 'Mail already verified'});
        }

        await  User.findByIdAndUpdate({_id: req.query.id},
            {
               $set:{
                     is_verified: 1
               } 
            });
            
            return res.render('mail-verification', { message: 'Mail has been verified successfully'});

    }else{
        console.log("hey");
        return res.render('mail-verification', { message: 'User not found'});
    }
    }catch(error){
           console.log(error.message);
           return res.render('404');
    }
}


const sendMailVerification = async (req, res) => {
   try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({ 
                success: false,
                msg: 'Errors 1',
                errors: errors.array()
             });
        }

    const {email} = req.body; 

    const userData = await User.findOne({email});

    if(!userData){
        return res.status(400).json({
             success: false,
            message: 'Email not found'
         });
    }
    if(userData.is_verified == 1){
        return res.status(400).json({
            success: false,
            message: userData.email+ 'Mail already verified'
        });
    }

    const msg = `<p> hiii, ${userData.name} please verify your <a href = "http://127.0.0.1:3000/mail-verification?id=${userData._id}">click herre</a>  </p>`;

        mailer.sendMail(userData.email, 'Mail Verification', msg);

   return res.status(200).json({ success: true,
         success: true,
         message: 'Verificaton sento to your mail'
         });
        
   }catch(error){
        return res.status(400).json({
            success: false,
            msg2: error.message
        })
   }
    }  


const forgotPassword = async (req, res) => {
        try{
            const errors = validationResult(req);

            if(!errors.isEmpty()){
                return res.status(400).json({ 
                    success: false,
                    msg: 'Errors',
                    errors: errors.array()
                 });
            }

            const {email} = req.body;
            const userData = await User.findOne({email});
            if(!userData){
                return res.status(400).json({
                    success: false,
                    message: 'Email not found'
                });
            }
        
        const randomString = randomstring.generate(10);
        const msg = `<p> hiii, ${userData.name} please verify your <a href = "http://127.0.0.1:3000/api/reset-password?token=${randomString}">click herre to reset your passwprd</a>  </p>`;   

    PasswordReset.deleteMany({user_id: userData._id});    
    const passwordReset = new PasswordReset({
            user_id : userData._id,
            token: randomString
        });
    
    await passwordReset.save();
    
    mailer.sendMail(userData.email, 'Password Reset', msg);

    return res.status(200).json({ 
        success: true,
        msg: 'Reset link sent to your mail, please check your mail'
    });
        
        }catch(error){
               return res.status(400).json({
                   success: false,
                   msg2: error.message
               });
        }
    }


const resetPassword = async (req, res) => {
    try{
         if(req.query.token == undefined){
             return res.render('404');
         }
        const resetData = await PasswortReset.findOne({token: req.query.token});
             if(!resetData){
               return res.render('404');
             }
            return res.render('reset-password', {resetData: resetData})
    }catch(error){
        return res.status(404).json({
            success: false,
            msg2: error.message
        })
    }
}    


const updatePassword = async (req, res) => {
    try{
      const {user_id, password, c_password} = request.body;
      const resetData = await PasswortReset.findOne({user_id});

      if(password != c_password){
          return res.render('reset-password', {resetData: resetData, message: 'Password and confirm password not matched'});
      }

      const hashedPassword = await bcrypt.hash(c_password, 10);

    await  User.findByIdAndUpdate({_id: user_id},{
            $set:{
                password: hashedPassword
            }
        });

        await PasswordReset.deleteMany({user_id: user_id});

        return res.redirect('/reset-success');
      
    }catch(error){
       
    }
}

const resetSuccess = async (req, res) => {
    try{
        return res.render('reset-success');
    }catch(error){
        return res.status(404).json({
            success: false,
            msg2: error.message
        })
    }
}


const generateAccessToken = async (user) => {
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '2h'});
    return token;
}

const loginUser = async (req, res) => {
    try{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                success: false,
                msg: 'Errors',
                errors: errors.array()
            });
        }

        const {email, password} = req.body;
        const userData = await User.findOne({email});
        if(!userData){
            return res.status(400).json({
                success: false,
                message: 'Email and password not matched'
            });
        }

        const passwordMatch = await bcrypt.compare(password, userData.password);
        if(!passwordMatch){
            return res.status(400).json({
                success: false,
                message: 'Email and password not matched'
            });
        }

        if(userData.is_verified == 0){
            return res.status(400).json({
                success: false,
                message: 'Please verify your email'
            });
        }       
        
       const accessToken = await generateAccessToken({user:userData});
         return res.status(200).json({
              success: true,
              message: 'Login successfully',
              user: userData,
              accessToken: accessToken,
              tokenType: 'Bearer'
         });
 
    }catch(error){

    }
}


const userProfile = async (req, res) => {
    try{
        const userData = req.user.user; 

        return res.status(200).json({
            success: true,
            msg: 'User profile data',
            data: userData
        });

    }catch(error){
         
        return res.status(404).json({
            success: false,
            msg: error.message
        })
    }
}


module.exports = {userRegister,
                mailVerification,
                sendMailVerification,
                forgotPassword,
                resetPassword,
                updatePassword,
                resetSuccess,
                loginUser,
                userProfile
            };