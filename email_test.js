// const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
// add fs
const fs = require('fs');
dotenv.config();
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// function makeid(length) {
//     var result           = '';
//     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     var charactersLength = characters.length;
//     for ( var i = 0; i < length; i++ ) {
//       result += characters.charAt(Math.floor(Math.random() * 
//  charactersLength));
//    }
//    return result;
// }

// let code = makeid(5);

// var user = 'Dotly'

// console.log(code);

// const msg = {
//   to: 'eliot.supceo@gmail.com',
//   from: {
//       email: 'discord@bhs.eliothertenstein.com',
//       name: 'Berkeley High Discord'
//   },
//   subject: 'Verify your Discord account!',
//   text: `Hello! Your verification code is: ${code}`,
//   html: `Hello! Your verification code is: <strong>${code}</strong>`,
// };
// //ES6
// sgMail
//   .send(msg)
//   .then(() => {}, error => {
//     console.error(error);

//     if (error.response) {
//       console.error(error.response.body)
//     }
//   });

var email = 'eliot.supceo@berkeley.net'

function validateBUSDEmail(email) {
    if (/berkeley.net\s*$/.test(email)) {
    console.log("it ends in @berkeley.net");
    return true;
    } else {
    console.log("it does not end in @berkeley.net");
    return false;
    };
};

validateBUSDEmail(email);