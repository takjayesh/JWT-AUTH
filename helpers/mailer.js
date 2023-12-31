const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    secure:false,
    requireTLS:true,
    auth:{
        user:process.env.SMTP_MAIL,
        pass:process.env.SMTP_PASSWORD,
    }

});

const sendMail = (email, subject, content) => {

    try{
         mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: subject,
            html: content
         };
      
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
              return false;
            } else {
              console.log('Email sent: ' + info.response);
              return true;
            }
          });
           
    }catch{
             
    }

};

module.exports = { sendMail };