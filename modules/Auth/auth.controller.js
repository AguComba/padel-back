import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { UpdatePassword, UserEmail, UserLogin, UserRegister } from '../../schemas/User.schema.js'
import { AuthModel } from './auth.model.js'
import { sendEmailRecovery } from '../Mails/mails.controller.js'

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
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000
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

export const recoveryPassword = async (req, res) => {
    try {
        const email = req.body

        const emailValidate = UserEmail.safeParse(email)
        if (!emailValidate.success) {
            return res.status(400).json(emailValidate.error.errors)
        }

        const token = crypto.randomBytes(32).toString('hex')
        const expiration = new Date(Date.now() + 3600000)

        const result = await AuthModel.recoveryPassword(token, expiration, emailValidate.data.email)
        if (result.affectedRows) {
            sendEmailRecovery(emailValidate.data.email, token)
        }

        return res.json({ message: 'Se envio un correo para restablecer la contraseña.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Ocurrio un error inesperado' })
    }
}

export const restorePassword = async (req, res) => {
    try {
        const { token = false } = req.query
        if (!token) {
            return res.status(400).json({ message: 'No se envio el token' })
        }

        const user = await AuthModel.searchUserByToken(token)
        if (!user) {
            return res.status(403).json({ message: 'Token invalido o expirado' })
        }

        const userResult = buildUserLoginResponse(user)
        res.json(userResult)
    } catch (error) {
        console.error(error)
        res.status(500).json('Ocurrio un error inesperado')
    }
}

export const updatePassword = async (req, res) => {
    try {
        const updateData = req.body
        const validData = UpdatePassword.safeParse(updateData)
        if (!validData.success) {
            return res.status(400).json(validData.error.errors)
        }

        validData.data.password = await AuthModel.hashPassword(validData.data.password)

        const result = await AuthModel.updatePassword(validData.data)
        if (!result.affectedRows) {
            return res.status(500).json({ message: 'Ocurrio un error al actaulizar la contraseña' })
        }

        return res.status(200).json(result)
    } catch (error) {
        console.error(error)
        return res.status(500).json(error.message)
    }
}
