import { executeQuery } from '../../utils/executeQuery.js'

export class CitiesModel {
    static async getAllCities() {
        try {
            const cities = await executeQuery('SELECT * FROM cities where status = 1 ORDER BY name')
            return cities
        } catch (error) {
            throw new Error('Error getting cities: ' + error.message)
        }
    }

    static async getCityById(id) {
        try {
            const city = await executeQuery('SELECT * FROM cities WHERE id = ?', [id])
            return city.shift()
        } catch (error) {
            throw new Error('Error getting city: ' + error.message)
        }
    }

    // static async getCityByProvince(id_province){
    //     try {
    //         const city = await executeQuery('SELECT * FROM cities WHERE id_province = ?', [id_province])
    //     } catch (error) {

    //     }
    // }

    static async addCity(city) {
        try {
            const cityResult = await executeQuery('INSERT INTO cities (name, zip_code, id_province) VALUES (?, ?, ?)', [
                city.name.toUpperCase(),
                city.zip_code,
                city.id_province
            ])
            const cityId = cityResult.insertId
            const [newCity] = await executeQuery('SELECT * FROM cities WHERE id = ?', [cityId])
            return newCity
        } catch (error) {
            throw new Error('Error creating city: ' + error.message)
        }
    }

    static async updateCityStatus(id, status) {
        try {
            await executeQuery('UPDATE cities SET status = ? WHERE id = ?', [status, id])
            const city = await executeQuery('SELECT * FROM cities WHERE id = ?', [id])
            return city.shift()
        } catch (error) {
            throw new Error('Error updating city: ' + error.message)
        }
    }
}
