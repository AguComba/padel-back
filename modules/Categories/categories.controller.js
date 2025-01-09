import { hasRole, isAcceptedUser } from '../../middlewares/permisions.js'
import { CategorySchema, updatedCategorySchema } from '../../schemas/Category.schema.js'
import { CategoryModel } from './categories.model.js'

export const getCategories = async (req, res) => {
  try {
    const { user = false } = req.session
    if (!isAcceptedUser(user)) {
      return res.status(401).json({ message: 'No tienes permisos para acceder a este recurso' })
    }

    const categories = await CategoryModel.search()
    res.status(200).json(categories)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const getCategory = async (req, res) => {
  try {
    const category = await CategoryModel.searchById(req.params.id)
    res.status(200).json(category)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const createCategory = async (req, res) => {
  try {
    const { user = false } = req.session
    if (!hasRole(user, ['admin', 'superAdmin'])) {
      return res.status(401).json({ message: 'No tienes permisos para acceder a este recurso' })
    }

    const category = req.body
    const validCategory = CategorySchema.safeParse(category)

    if (!validCategory.success) {
      return res.status(400).json({ message: validCategory.error.errors[0].message })
    }

    const newCategory = await CategoryModel.create(validCategory.data)
    res.status(201).json(newCategory)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

export const statusCategory = async (req, res) => {
  try {
    const { user = false } = req.session
    if (!hasRole(user, ['admin', 'superAdmin'])) {
      return res.status(401).json({ message: 'No tienes permisos para acceder a este recurso' })
    }

    const category = req.body
    category.user_updated = user.id

    const validCategory = updatedCategorySchema.safeParse(category)
    if (!validCategory.success) {
      return res.status(400).json({ message: validCategory.error.errors[0].message })
    }

    const updatedCategory = await CategoryModel.handleStatus(validCategory.data)
    res.status(200).json(updatedCategory)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
