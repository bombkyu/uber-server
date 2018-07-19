import Mailgun from "mailgun-js";

const mailgunClient = new Mailgun({
    apiKey:process.env.MAILGUN_API_KEY || "",
    domain:"sandbox5b4d4c3799e343838831e81a9eb840c5.mailgun.org"
})

const sendEmail = (subject:string, html:string) => {
    const emailData = {
        from:"bombkyu@gmail.com",
        to:"bombkyu@gmail.com",
        subject,
        html
    }

    return mailgunClient.messages().send(emailData);
}

export const sendVerificationEmail = (fullname:string, key:string) => {
    const emailSubject = `Hello! ${fullname}, please verify your email`;
    const emailBody = `Verify your email by clicking <a href="uber.com/verification/${key}>here</a>`;

    return sendEmail(emailSubject, emailBody);
}