import * as nodemailer from 'nodemailer';
export default class MailGun{
    static fireMessage(mail:string, message:string){
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_ACCOUNT,
                pass: process.env.GMAIL_PASSWORD
            }
        });

        console.log(mail);

        const mailOptions = {
            from: process.env.FROM_EMAIL,
            to: mail,
            subject: 'Message from SoftServe LMS',
            html: `<p>${message}</p>`
        };

        transporter.sendMail(mailOptions, function (err, info) {
            err ? console.log(err) : console.log(info);
        });
    }
}
