import { isAcceptedUser, isPlayer } from '../../middlewares/permisions.js'
import { RankingModel } from './ranking.model.js'

export const getRanking = async (req, res) => {
  try {
    const { user = false } = req.session
    if (!isAcceptedUser(user)) {
      return res.status(401).json({ message: 'No tienes permisos para acceder a este recurso' })
    }

    const ranking = await RankingModel.search()
    res.status(200).json(ranking)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
