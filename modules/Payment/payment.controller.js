import pkg from "pluspagos-aes-encryption"
import { isAcceptedUser } from "../../middlewares/permisions.js"
import {PaymentModel} from "./payment.model.js"

export const payment = async (req, res) => {
  try {
    const { user = false } = req.session
    if (!isAcceptedUser(user)) {
      return res
        .status(401)
        .json({ message: "No tienes permisos para acceder a este recurso" })
    }
    const payment = req.body
    payment.id_user = user.id
    const transaction_id = await PaymentModel.create(payment)
    if(!transaction_id){
      return res.status(500).json({ message: "Error al crear el pago" })
    }
    const { amount, type } = payment
    const { encryptString } = pkg
    const secret = "ASOCIACIONPADELCLUB_77b704d8-e759-4d64-bd27-48bf3d95052c"
    const comercio = "8ff45ee1-1acc-4855-bcac-d277fc9a3ff7"
    const success = "https://www.apcpadel.com.ar/pagoexitoso"
    const failure = "https://www.apcpadel.com.ar/pagofallido"
    const sucursal = ""
    const monto = parseInt(amount) * 100
    const information = type + " APC"
    const data = {
      success: encryptString(success, secret),
      failure: encryptString(failure, secret),
      sucursal: encryptString(sucursal, secret),
      monto_encrypt: encryptString(monto, secret),
      monto,
      info: encryptString(information, secret),
      descripcion: information,
      comercio,
      transaction_id,
    }
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor: " + error.message })
  }
}

export const paymentStatus = async (req, res) => {
  res.status(200).json({ message: "Pago exitoso" })
}
