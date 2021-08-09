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

// var email = 'eliot.supceo@berkeley.net'

// function validateBUSDEmail(email) {
//     if (/berkeley.net\s*$/.test(email)) {
//     console.log("it ends in @berkeley.net");
//     return true;
//     } else {
//     console.log("it does not end in @berkeley.net");
//     return false;
//     };
// };

// validateBUSDEmail(email);

if (interaction.channel.id !== '787039874384396329') {
    const embed = {
      color: 0xeff624,
      title: 'Verification',
      description: `**${user.tag}** has already been verified!`,
      timestamp: new Date(),
    };
    await interaction.reply({ content: { embeds: [embed] },  ephemeral: true });
    return;
  };

  var email = interaction.options.get('email');
  console.log(email.value);
  var email = email.value.toLowerCase();

  var id = interaction.user.id;

  // stop function if email is invalid
  if (!validateEmail(email)) {
    const embed = {
      color: 0xeff624,
      title: 'Verification',
      description: `Invalid Email! Please try again.`,
      timestamp: new Date(),
    };
    await interaction.reply({ content: { embeds: [embed] },  ephemeral: true });
    return;
  };

  if (!validateBUSDEmail(email)) {
    const embed = {
      color: 0xeff624,
      title: 'Verification',
      description: `Invalid Email! Please try again.`,
      timestamp: new Date(),
    };
    await interaction.reply({ content: { embeds: [embed] },  ephemeral: true });
    return;
  };

  // load emails database

  var emailsJSON = fs.readFileSync('./emails.json', 'utf8');
  var emailsDatabase = JSON.parse(emailsJSON);

  // see if email appears in array
  function emailExists(email) {
    for (var i = 0; i < emailsDatabase.length; i++) {
      if (emailsDatabase[i].email === email) {
        return true;
      }
    }
    return false;
  };

  // check if id appears in array
  function idExists(id) {
    for (var i = 0; i < emailsDatabase.length; i++) {
      if (emailsDatabase[i].id === id) {
        return true;
      }
    }
    return false;
  };

  var emailCheck = emailExists(email);
  var idCheck = idExists(id);

  if (emailCheck) {
    const embed = {
      color: 0xeff624,
      title: 'Verification',
      description: `**${email}** has already been verified!`,
      timestamp: new Date(),
    };
    await interaction.reply({ content: { embeds: [embed] },  ephemeral: true });
    return;
  };

  if (!idCheck) {

    // send verification email to user

    let code = makeid(5);

    const msg = {
      to: `${email}`,
      from: {
          email: 'discord@bhs.eliothertenstein.com',
          name: 'Berkeley High Discord'
      },
      subject: 'Verify your Discord account!',
      text: `Hello! Your verification code is: ${code}.\nThis code will expire in 5 minutes!`,
      html: `Hello! Your verification code is: <strong>${code}</strong>`,
    };

    sgMail
      .send(msg)
      .then(() => {}, error => {
        console.error(error);
    
        if (error.response) {
          console.error(error.response.body)
        }
    });

    // send user DM
    const embed = {
      color: 0xeff624,
      title: 'Verification',
      description: `I've sent an email to ${email}! Please reply to this DM with the verification code. The code expires in 5 minutes.`,
      timestamp: new Date(),
    };

    let initialDM = await user.send({ embeds: [embed] });

    // wait for user to reply with code

    initialDM.channel.awaitMessages(filter, {
      max: 1,
      time: 30000,
      errors: ['time'],
    }).then(message => async function () {
      message = message.first();
      const userCode = message.content;
      if (userCode === code) {

        // add user to array
        const newUser = {
          id: id,
          email: email,
          id: id,
        };
        emailsDatabase.push(newUser);
        fs.writeFileSync('./emails.json', JSON.stringify(emailsDatabase));

        // send verification message
        const embed = {
          color: 0xeff624,
          title: 'Verification',
          description: `**${user.tag}** has been verified!`,
          timestamp: new Date(),
        };

        await user.send({ embeds: [embed] });
    } else {
      user.send('Code invalid, please try again later!');
    };
  });
  } else {
    // send verification message
    const embed = {
      color: 0xeff624,
      title: 'Verification',
      description: `You are already verified!`,
      timestamp: new Date(),
    };

    await interaction.reply({content: { embeds: [embed] }, ephemeral: true});

    user.roles.add('762720121205555220');
  };