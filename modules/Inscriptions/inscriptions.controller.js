import { hasRole } from '../../middlewares/permisions.js'

export const createInscription = async (req, res) => {
  try {
    const { user = null } = req.session
    if (!hasRole(user, ['player', 'admin', 'superAdmin'])) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' })
    }
    res.send('Inscription created')
  } catch (error) {
    console.log(error)
  }
}
