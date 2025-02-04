import pkg from "pluspagos-aes-encryption"
export const payment = async (req, res) => {
  try {
    const { encryptString } = pkg
    const secret = "ASOCIACIONPADELCLUB_77b704d8-e759-4d64-bd27-48bf3d95052c"
    const comercio = "8ff45ee1-1acc-4855-bcac-d277fc9a3ff7"
    const success = "https://www.google.com"
    const failure = "https://www.google.com"
    const sucursal = ""
    const monto = "10000.00"
    const data = {
      success: encryptString(success, secret),
      failure: encryptString(failure, secret),
      sucursal: encryptString(sucursal, secret),
      monto: encryptString(monto, secret),
      info: encryptString("Pago de cuota", secret),
    }
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor" })
  }
}
