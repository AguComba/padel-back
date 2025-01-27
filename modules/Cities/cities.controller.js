import { isAcceptedUser, hasRole, isAdmin } from '../../middlewares/permisions.js'
import { City } from '../../schemas/City.schema.js'
import { CitiesModel } from './cities.model.js'

const getAllCities = async (req, res) => {
    try {
        const { id_province = false } = req.query
        const cities = await CitiesModel.getAllCities()
        if (id_province) {
            const filteredCities = cities.filter((city) => {
                return city.id_province == id_province
            })
            return res.status(200).json(filteredCities)
        }
        res.status(200).json(cities)
    } catch (error) {
        res.status(401).json(error.message)
    }
}

const getCitiesByIdProvince = async (req, res) => {}

const getCityById = async (req, res) => {
    try {
        const { user = false } = req.session
        if (!isAcceptedUser(user)) {
            throw new Error('No tiene permisos para ver una ciudad')
        }
        const { id } = req.params
        const city = await CitiesModel.getCityById(id)
        res.status(200).json(city)
    } catch (error) {
        res.status(401).json(error.message)
    }
}

const validateCity = (city) => {
    const cityValidate = City.safeParse(city)
    if (!cityValidate.success) {
        throw new Error('ValidationError')
    }
    return cityValidate.data
}

const createCity = async function (req, res) {
    try {
        const { user = false } = req.session
        if (!hasRole(user, ['admin', 'fiscal'])) {
            throw new Error('No tiene permisos para crear una ciudad')
        }

        const city = req.body
        const cityValidate = validateCity(city)

        const newCity = await CitiesModel.addCity(cityValidate)
        res.status(201).json(newCity)
    } catch (error) {
        res.status(401).json(error.message)
    }
}

const updateCityStatus = async function (req, res) {
    try {
        const { user = false } = req.session
        if (!isAdmin(user)) {
            throw new Error('No tiene permisos para actualizar una ciudad')
        }

        const { id } = req.params
        const city = await CitiesModel.getCityById(id)
        const newStatus = city.status === 1 ? 0 : 1

        const updatedCity = await CitiesModel.updateCityStatus(id, newStatus)
        res.status(200).json(updatedCity)
    } catch (error) {
        res.status(401).json(error.message)
    }
}

export { getAllCities, getCityById, createCity, updateCityStatus }
