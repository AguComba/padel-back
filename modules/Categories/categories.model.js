import { executeQuery } from '../../utils/executeQuery.js'

export class CategoryModel {
    static async search() {
        try {
            const rows = await executeQuery('SELECT * FROM categories where status = 1')
            return rows
        } catch (error) {
            throw new Error('Error fetching categories: ' + error.message)
        }
    }

    static async searchById(id) {
        try {
            const rows = await executeQuery('SELECT * FROM categories WHERE id = ?', [id])
            return rows.shift()
        } catch (error) {
            throw new Error('Error fetching category by ID: ' + error.message)
        }
    }

    static async create(category) {
        try {
            const result = await executeQuery('INSERT INTO categories (name) VALUES (?)', [category.name])
            const [newCategory] = await executeQuery('SELECT * FROM categories WHERE id = ?', [result.insertId])
            return newCategory.shift()
        } catch (error) {
            throw new Error('Error creating category: ' + error.message)
        }
    }

    static async handleStatus(category) {
        try {
            const result = await executeQuery(
                'UPDATE categories SET status = ?, user_updated = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [category.status, category.user_updated, category.id]
            )
            if (result.affectedRows === 0) throw new Error('No se pudo actualizar el estado de la categoría')
            const [updatedCategory] = await executeQuery('SELECT * FROM categories WHERE id = ?', [category.id])
            return updatedCategory.shift()
        } catch (error) {
            throw new Error('Error updating category status: ' + error.message)
        }
    }
}
