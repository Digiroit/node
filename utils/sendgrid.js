// SendGrid
const pkg = require('@sendgrid/mail');
const { mailActions } = require('./../config/sendgridMails');

const sgMail = pkg;

sgMail.setApiKey(process.env.SENDGRID_KEY)

// const msg = {
//     to: '', // Change to your recipient
//     from: '', // Change to your verified sender
//     subject: 'Sending with SendGrid is Fun',
//     text: 'and easy to do anywhere, even with Node.js',
//     html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }
// sgMail
//     .send(msg)
//     .then(() => {
//         console.log('Email sent')
//     })
//     .catch((error) => {
//         console.error(error)
//     })

/**
   "from": {
      "email": "example@.sendgrid.net"
   },
   "personalizations": [
      {
         "to": [
            {
               "email": "example@sendgrid.net"
            }
         ],
         "dynamic_template_data": {
            "total": "$ 239.85",
            "items": [
               {
                  "text": "New Line Sneakers",
                  "image": "https://marketing-image-production.s3.amazonaws.com/uploads/8dda1131320a6d978b515cc04ed479df259a458d5d45d58b6b381cae0bf9588113e80ef912f69e8c4cc1ef1a0297e8eefdb7b270064cc046b79a44e21b811802.png",
                  "price": "$ 79.95"
               },
               {
                  "text": "Old Line Sneakers",
                  "image": "https://marketing-image-production.s3.amazonaws.com/uploads/3629f54390ead663d4eb7c53702e492de63299d7c5f7239efdc693b09b9b28c82c924225dcd8dcb65732d5ca7b7b753c5f17e056405bbd4596e4e63a96ae5018.png",
                  "price": "$ 79.95"
               },
               {
                  "text": "Blue Line Sneakers",
                  "image": "https://marketing-image-production.s3.amazonaws.com/uploads/00731ed18eff0ad5da890d876c456c3124a4e44cb48196533e9b95fb2b959b7194c2dc7637b788341d1ff4f88d1dc88e23f7e3704726d313c57f350911dd2bd0.png",
                  "price": "$ 79.95"
               }
            ],
            "receipt": true,
            "name": "Sample Name",
            "address01": "1234 Fake St.",
            "address02": "Apt. 123",
            "city": "Place",
            "state": "CO",
            "zip": "80202"
         }
      }
   ],
   "template_id": "[template_id]"
} */

function getTemplateIdByAction(actionType) {
   let selectedAction = mailActions.filter(temp => temp.action == actionType);
   return selectedAction[0].id;
}

exports.sendMail = async (options) => {
   console.log(options, "<<<<<<<")
   let mailOptions = {};
   mailOptions['from'] = process.env.SENDGRID_EMAIL;
   mailOptions['to'] = options.user.email;

   mailOptions['personalizations'] = [{}];
   mailOptions['personalizations'][0]['to'] = [options.user.email];
   mailOptions['personalizations'][0]['dynamic_template_data'] = options;
   mailOptions['templateId'] = await getTemplateIdByAction(options.actionType);
   console.log(mailOptions, "<<<<<<<")

   return await sgMail.send(mailOptions);
}