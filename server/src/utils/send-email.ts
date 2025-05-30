import nodemailer from "nodemailer";
import { Verification_Email_Template } from "./EmailTemplet";

const transpotar = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "mdrmoney34@gmail.com",
    pass: "akei uejk wire fism",
  },
});

interface emailData {
  email: string;
  verificationCode: string;
}

export const sendVerificationCode = async ({
  email,
  verificationCode,
}: emailData) => {
  const info = await transpotar.sendMail({
    from: "E-commerce <mdrmoney34@gmail.com>",
    to: email,
    subject: "Email verification",
    text: "verify Your email",
    html: Verification_Email_Template.replace(
      "{verificationCode}",
      verificationCode
    ),
  });
};
