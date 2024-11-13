import jwt from "jsonwebtoken"

export const login = (req, res) => {
    try {
        const { username, id, role } = req.body
        // Simulamos que pasa el login y generamos el jwt
        const token = jwt.sign(
            { id, username, role },
            process.env.SECRET_JWT_KEY,
            {
                expiresIn: "1h",
            }
        )
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // solo se envía en HTTPS
            sameSite: "strict", // la cookie solo se puede acceder desde el mismo sitio
        }).send({ username, id, role, token })
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const register = (req, res) => {
    res.status(200).send("Register")
}
