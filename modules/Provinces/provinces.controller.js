import { isAcceptedUser } from '../../middlewares/permisions.js'
import { ProvincesModel } from './provinces.model.js'

const getProvinces = async (req, res) => {
    try {
        const provinces = await ProvincesModel.getProvinces()
        res.status(200).json(provinces)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const getProvinceById = async (req, res) => {
    try {
        const { user = false } = req.session
        if (!isAcceptedUser(user)) {
            throw new Error('No tiene permisos para ver una ciudad')
        }
        const id = req.params.id
        const province = await ProvincesModel.getProvinceById(id)
        res.status(200).json(province)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export { getProvinces, getProvinceById }
