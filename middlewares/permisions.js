// Aca van las funciones para los permisos de los diferentes roles de usuario. Se usan dentro de los controladores de los modulos.
// Obtienen el rol del usuario en base a la sesion y el token, y devuelven true o false segun el permiso que tenga.

/**
 * Verifica si un usuario tiene uno de los roles requeridos.
 *
 * @param {Object} user - El objeto del usuario que contiene información del usuario.
 * @param {Array<string>} roles - Una lista de roles requeridos.
 * @returns {boolean} - Retorna true si el usuario tiene uno de los roles requeridos, de lo contrario false.
 *
 * Roles admitidos y sus valores numéricos:
 * - player: 1
 * - admin: 2
 * - fiscal: 3
 * - largador: 4
 * - superAdmin: 5
 */
const hasRole = (user, roles) => {
  const dictionary = {
    player: 1,
    admin: 2,
    fiscal: 3,
    largador: 4,
    superAdmin: 5,
  }
  const requiredRoles = roles.map((role) => dictionary[role])
  return requiredRoles.includes(user?.typeUser)
}

const isPlayer = (user) => {
  return user?.typeUser === 1
}

const isAdmin = (user) => {
  return user?.typeUser === 2
}

const isFiscal = (user) => {
  return user?.typeUser === 3
}

const isDropper = (user) => {
  return user?.typeUser === 4
}

const isAcceptedUser = (user) => {
  return user?.typeUser === 1 || user?.typeUser === 2 || user?.typeUser === 3 || user?.typeUser === 4 || user?.typeUser === 5
}

export { isPlayer, isAdmin, isFiscal, isDropper, isAcceptedUser, hasRole }
