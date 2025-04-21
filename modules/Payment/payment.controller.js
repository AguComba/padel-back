import pkg from "pluspagos-aes-encryption"
import { isAcceptedUser } from "../../middlewares/permisions.js"
import { PaymentModel } from "./payment.model.js"
import { MACRO_COMMERCE_ID, MACRO_SECRET, MACRO_FRASE } from "../../config/app.config.js"
import axios from "axios"

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
    if (!transaction_id) {
      return res.status(500).json({ message: "Error al crear el pago" })
    }
    const { amount, type } = payment
    const { encryptString } = pkg
    const secret = MACRO_SECRET
    const comercio = MACRO_COMMERCE_ID
    const success = "https://apcpadel.com.ar/pagoexitoso"
    const failure = "https://apcpadel.com.ar/pagofallido"
    const sucursal = ""
    const monto = parseInt(amount) * 100
    let montoTotal = monto
    const information = type + " APC"
    let recargo = 0
    if(payment.type === "INSCRIPCION"){
      recargo = monto * 0.1
      montoTotal += recargo
    }
    const data = {
      success: encryptString(success, secret),
      failure: encryptString(failure, secret),
      sucursal: encryptString(sucursal, secret),
      monto_encrypt: encryptString(montoTotal, secret),
      monto,
      info: encryptString(information, secret),
      descripcion: information,
      comercio,
      transaction_id,
      recargo
    }
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor: " + error.message })
  }
}

export const paymentStatus = async (req, res) => {
  try {
    const data = req.body
    const dataDb = {
      transaction_id: data.TransaccionComercioId,
      status: data.Estado === "REALIZADA" && data.Tipo === "PAGO" ? 1 : 2,
      message: data.Detalle,
      external_id: data.TransaccionPlataformaId
    }
    const payment = await PaymentModel.update(dataDb)
    res.status(200).json({ message: "Pago procesado", payment })
  } catch (e) {
    res.status(500).json({ message: "Error en el servidor: " + e.message })
  }
}

const getToken = async (req, res) => {
  try{
    const payload = {
      guid: MACRO_COMMERCE_ID,
      frase: MACRO_FRASE
    }
    const {data} = await axios.post('https://botonpp.asjservicios.com.ar:8082/v1/sesion', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return data.data
  }catch(e){
    console.log(e)
    return false
  }
}

// Funcion para ejecutar en las tareas automatizadas
export const paymentTask = async (req, res) => {
  try{
    const token = await getToken()
    console.log(token)
    const header = `Bearer ${token}`
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)
    const formattedDate = formatDate(yesterday)
    const {data} = await axios.get(`https://botonpp.asjservicios.com.ar:8082/v1/transactions?FechaDesde=${formattedDate}&FechaHasta=${formattedDate}&EstadoTransaccion=3`, {
      headers: {
        Authorization: header
      }})
    if(!data){
      console.log('No hay pagos para procesar')
      return
    }
    res.status(200).json(data)
  }catch(e){
    res.status(500).json({ message: "Error en el servidor: " + e.message })
  }
}

const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
