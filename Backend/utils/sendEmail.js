
import nodemailer from 'nodemailer'

export const sendEmail = async ({
    to="",
    message="",
    subject="",
    attachments = []
})=>{
    try {
        // email configuration
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: "drdoserr@gmail.com",
              pass: 'wqkg huhr ktih wfgx',
            },
          });

          const info = await transporter.sendMail({
            from: "Pint <drdoserr@gmail.com>",
            to,
            html: message,
            subject,
            attachments
          });
          
          if(info.accepted.length){
            return true;
          }
          return false;
    } catch (error) {
        console.error('Email sending error:', error);
        throw error;
    }
}