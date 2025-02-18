import { Resend } from 'resend'
import { ENVAIROMENT, FRONT_URL } from '../../config/app.config.js'

const resend = new Resend('re_Ti4c2orp_HUc5JymHW9jLz1w5ujZ18REb')
export const sendEmailUser = async (req, res) => {
    const { email } = req.body

    try {
        const { data, error } = await resend.emails.send({
            from: 'APC  <noresponder@apcpadel.com.ar>',
            to: [email],
            subject: 'Activar cuenta de APC',
            html: '<strong>Para activar la cuenta hace click aca</strong>'
        })
        if (error) {
            console.log(error)
            throw new Error(error.message)
        }
        res.status(200).json(data)
        return data
    } catch (error) {
        res.status(500).json(error.message)
    }
}

export const sendEmailRecovery = async (email, token) => {
    const reset_link = ENVAIROMENT === 'local' ? `http://localhost:1420/auth/resetPassword?token=${token}` : FRONT_URL
    const { data, error } = await resend.emails.send({
        from: 'APC  <noresponder@apcpadel.com.ar>',
        to: [email],
        subject: 'Restablecer contraseña de APC',
        html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Recuperación de contraseña</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
        }
        h2 {
            color: #333;
        }
        p {
            color: #666;
            font-size: 16px;
        }
        .button {
            display: inline-block;
            background: #007BFF;
            color: #ffffff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 20px;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <h2>Recuperación de Contraseña</h2>
        <p>Hola,</p>
        <p>Hemos recibido una solicitud para restablecer tu contraseña. Si no hiciste esta solicitud, simplemente ignora este correo.</p>
        <p>Para restablecer tu contraseña, haz clic en el siguiente botón:</p>
        <a href="${reset_link}" class="button">Restablecer Contraseña</a>
        <p class="footer">Este enlace expirará en 1 hora. Si tienes problemas, contacta con nuestro soporte.</p>
    </div>
</body>
</html>
`
    })
    if (error) {
        console.log(error)
        throw new Error(error.message)
    }
    return data
}
