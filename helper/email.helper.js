const nodemailer = require("nodemailer");
const fs = require("fs");

const fromat_mail_data = data => {
    let data_string = "";
    for(const key in data) {
        data_string = data_string + (`\n ${key} : ${data[key]}`);
    }
    return (data_string)
}

exports.send_email = function (email, html, sender_email, sender_password) {
    return new Promise((resolve, reject) => {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: sender_email,
                pass: sender_password,
            },
        });

        const mailOptions = {
            from: sender_password,
            to: email,
            subject: `New Inquiry from ${email}`,
            text: html,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                reject({ failed: true, err: error });
            } else {
                console.log(info);
                resolve({ failed: false, data: info.response });
            }
        });
    });
};