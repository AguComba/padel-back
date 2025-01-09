import { connection } from '../../config/db.config.js'
export class CategoryModel {
  static async search() {
    const [rows] = await connection.query('SELECT * FROM categories where status = 1')
    return rows
  }

  static async searchById(id) {
    const [rows] = await connection.query('SELECT * FROM categories WHERE id = ?', [id])
    return rows.shift()
  }

  static async create(category) {
    const [result] = await connection.query('INSERT INTO categories (name) VALUES (?)', [category.name])
    const [newCategory] = await connection.query('SELECT * FROM categories WHERE id = ?', [result.insertId])
    return newCategory.shift()
  }

  static async handleStatus(category) {
    const [result] = await connection.query('UPDATE categories SET status = ?, user_updated = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [category.status, category.user_updated, category.id])
    if (result.affectedRows === 0) throw new Error('No se pudo actualizar el estado de la categoria')
    const [updatedCategory] = await connection.query('SELECT * FROM categories WHERE id = ?', [category.id])
    return updatedCategory.shift()
  }
}
