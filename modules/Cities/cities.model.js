import { connection } from '../../config/db.config.js'

export class CitiesModel {
  static async getAllCities() {
    try {
      const [cities] = await connection.query('SELECT * FROM cities where status = 1')
      return cities
    } catch (error) {
      throw new Error('Error getting cities: ' + error.message)
    }
  }

  static async getCityById(id) {
    try {
      const [city] = await connection.query('SELECT * FROM cities WHERE id = ?', [id])
      return city.shift()
    } catch (error) {
      throw new Error('Error getting city: ' + error.message)
    }
  }

  static async addCity(city) {
    try {
      const [cityResult] = await connection.query('INSERT INTO cities (name, zip_code, id_province) VALUES (?, ?, ?)', [city.name.toUpperCase(), city.zip_code, city.id_province])
      const cityId = cityResult.insertId
      const [newCity] = await connection.query('SELECT * FROM cities WHERE id = ?', [cityId])
      return newCity[0]
    } catch (error) {
      throw new Error('Error creating city: ' + error.message)
    }
  }

  static async updateCityStatus(id, status) {
    try {
      await connection.query('UPDATE cities SET status = ? WHERE id = ?', [status, id])
      const [city] = await connection.query('SELECT * FROM cities WHERE id = ?', [id])
      return city.shift()
    } catch (error) {
      throw new Error('Error updating city: ' + error.message)
    }
  }
}
