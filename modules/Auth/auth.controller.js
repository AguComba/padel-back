import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { UserLogin, UserRegister } from '../../schemas/User.schema.js'
import { AuthModel } from './auth.model.js'
import { Resend } from 'resend'

const createToken = (user) => {
    return jwt.sign(user, process.env.SECRET_JWT_KEY, {
        expiresIn: '4h'
    })
}

const validateUser = (user) => {
    const userValidate = UserLogin.safeParse(user)
    if (!userValidate.success) {
        throw new Error('ValidationError')
    }
    return userValidate.data
}

const verifyPassword = async (inputPassword, storedPassword) => {
    const isValidPassword = await bcrypt.compare(inputPassword, storedPassword)
    if (!isValidPassword) {
        throw new Error('InvalidCredentials')
    }
}

const handleError = (error, res) => {
    if (error.message === 'ValidationError') {
        return res.status(400).json({ error: 'Invalid user data' })
    }
    if (error.message === 'InvalidCredentials') {
        return res.status(401).send('Usuario o contraseña incorrectos')
    }
    return res.status(500).send(error.message)
}

const buildUserLoginResponse = (userResult) => {
    return {
        id: userResult.id,
        email: userResult.email,
        typeUser: userResult.type_user,
        name: userResult.name,
        last_name: userResult.last_name,
        gender: userResult.gender
    }
}

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

export const login = async (req, res) => {
    try {
        const user = req.body
        const userValidate = validateUser(user)

        const userResult = await AuthModel.loginUser(userValidate.email)
        if (!userResult) {
            throw new Error('InvalidCredentials')
        }

        await verifyPassword(userValidate.password, userResult.password)

        const userResponse = buildUserLoginResponse(userResult)

        const token = createToken(userResponse)

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none'
        }).json(userResponse)
    } catch (error) {
        handleError(error, res)
    }
}

export const register = async (req, res) => {
    try {
        const user = req.body
        const userValidate = UserRegister.safeParse(user)
        if (!userValidate.success) {
            return res.status(400).json(userValidate.error.errors)
        }
        // Si el usuario es valido hashemaos la contraseña
        userValidate.data.password = await AuthModel.hashPassword(userValidate.data.password)
        // Llamamos a la función de registro
        const userResult = await AuthModel.registerUser(userValidate.data)
        if (userResult) {
            // const sendMail = await sendEmailUser(userValidate.data.email)
        }
        res.status(200).json(userResult)
    } catch (error) {
        console.log(sendEmailUser)
        res.status(500).send(error.message)
    }
}

export const logout = (req, res) => {
    res.clearCookie('access_token').send('Logout')
}
