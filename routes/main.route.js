const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const util = require("util");
const errorResponse = require("../helper/error.helper");
const { asyncHandler, give_response } = require("../helper/common.helper");
const { setupEmailTemplateForVerification, send_email } = require("../helper/email.helper");

router.get("/", (req, res) => {
    res.send("welcome");
});

const fromat_mail_data = data => {
    let data_string = "New Inquiry from website:";
    for(const key in data) {
        data_string = data_string + (`\n ${key} - ${data[key]}`);
    }
    return (data_string)
}


router.post(
  "/handle-mail",
  [
    check("sender_email").exists(),
    check("sender_password").exists(),
    check("reciver_email").exists(),
    check("data").exists(),
  ],
  asyncHandler(async (req, res) => {

    const {
      data,
      sender_email,
      sender_password,
      reciver_email
    } = req.body

    const email_status = await send_email(reciver_email, fromat_mail_data(data), sender_email, sender_password);
    if (email_status.failed) {
      give_response(res, 502, false, `EMAIL NOT SENT TO ${reciver_email}`);
    } else {
      console.log(`EMAIL SUCCESSFULLY SENT TO ${reciver_email}`);
    }

    res.status(200).json({
      success: true,
      message: "Inquiry Send Successfully.",
      data: {},
    });
  })
);

module.exports = router;