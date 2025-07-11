const nodemailer = require("nodemailer");
const fs = require("fs");

const fromat_mail_data = data => {
    let data_string = "";
    for(const key in data) {
        data_string = data_string + (`<br/> ${key} : ${data[key]}`);
    }
    return (data_string)
}

const html = `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <title>Website Inquiry</title>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        </head>

        <body style="width: 680px; margin: 0 auto; font-family: 'Inter', sans-serif;">
            <table style="width: 680px; margin: 0 auto; border-collapse: collapse; border-top: 6px solid #F5BF6A; border-color: #F5BF6A; border-left: 1px solid #ededf2; border-right: 1px solid #ededf2; border-bottom: 1px solid #ededf2;">
                <thead>
                    <tr>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tbody>
                                    <tr>
                                        <td style="text-align: center; padding: 50px 15px 15px 15px;">
                                            <span style="font-family: 'Inter', sans-serif; font-weight: bold; font-size: 22px; line-height: 28px; color: #1a1a1a; display: block;">
                                                New Inquiry
                                            </span>
                                            <span style="font-family: 'Inter', sans-serif; font-size: 16px; line-height: 28px; text-align: center; color: #1a1a1a; display: block; padding-top: 15px;">
                                                {{data}}
                                            </span>
                                            <!-- <span style="text-align: center; margin: 20px auto 50px auto; display: block;">
                                                <a
                                                    href="{{link}}"
                                                    style="
                                                        font-family: 'Inter', sans-serif;
                                                        display: inline-block;
                                                        background-color: #F5BF6A;
                                                        font-weight: 400;
                                                        font-size: 14px;
                                                        text-align: center;
                                                        color: #000;
                                                        width: auto;
                                                        padding: 13px 13px;
                                                        border: 0;
                                                        border-radius: 4px;
                                                        cursor: pointer;
                                                        outline: none;
                                                        margin: auto;
                                                        text-decoration: none;
                                                    "
                                                >
                                                    Verify Now
                                                </a>
                                            </span> -->
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f7fafc; font-size: 14px; padding: 15px; text-align: center; line-height: 18px; letter-spacing: 0.01em; text-transform: capitalize; color: #a4aab1;">
                            Copyright © All Right Reserved.
                        </td>
                    </tr>
                </tbody>
            </table>
        </body>
    </html>

`

exports.setupEmailTemplateForVerification = function (data) {
    return new Promise(async (resolve, reject) => {
        const formated_mail_data = fromat_mail_data(data);
        const custom_html = html.split("{{data}}").join(formated_mail_data);
        console.log(custom_html);
        resolve({ custom_html });
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