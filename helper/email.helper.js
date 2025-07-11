const nodemailer = require("nodemailer");
const fs = require("fs");

const fromat_mail_data = data => {
    let data_string = "";
    for(const key in data) {
        data_string = data_string + (`<br/> ${key} : ${data[key]}`);
    }
    return (data_string)
}

exports.setupEmailTemplateForVerification = function (data) {
    return new Promise(async (resolve, reject) => {
        const name = "./emailpages/magic-link.html";
        const formated_mail_data = fromat_mail_data(data);
        fs.readFile(name, { encoding: "utf-8" }, (err, html) => {
            if (err) {
                reject(err); 
            } else {
                html = html.split("{{data}}").join(formated_mail_data);
                resolve({ html });
            }
        });
    });
};

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
            subject: `New Inquiry for ${email}`,
            html: html,
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