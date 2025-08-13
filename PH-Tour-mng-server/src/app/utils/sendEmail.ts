import AppError from '../errorHalpers/AppError'
import nodemailer from 'nodemailer'
import { envVars } from '../config/env'
import path from 'path'
import ejs from 'ejs'

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
    secure: true,
    auth: {
        user: envVars.EMAIL_SENDER.SMTP_USER,
        pass: envVars.EMAIL_SENDER.SMTP_PASS
    }
})

interface SendEmailOptions {
    to: string,
    subject: string,
    templateName: string,
    templateData?: Record<string, any>,
    attachments?: {
        fileName: string,
        content: Buffer | string,
        contentType: string
    }[]
}

export const sendEmail = async ({
    to,
    subject,
    templateName,
    templateData,
    attachments
}: SendEmailOptions) => {
    try {
        const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
        console.log(templatePath)
        const html = await ejs.renderFile(templatePath, templateData)
        const info = await transporter.sendMail({
            from: envVars.EMAIL_SENDER.SMTP_FROM,
            to: to,
            subject: subject,
            html: html,
            attachments: attachments?.map(attachment => ({
                filename: attachment.fileName,
                content: attachment.content,
                contentType: attachment.contentType
            }))
        })
        console.log(`\u2709\uFE0F Email sent to ${to}: ${info.messageId}`);
    } catch (error: any) {
        throw new AppError(401, "Email sending error")
    }

}

