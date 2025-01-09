// Aca van las funciones para los permisos de los diferentes roles de usuario. Se usan dentro de los controladores de los modulos.
// Obtienen el rol del usuario en base a la sesion y el token, y devuelven true o false segun el permiso que tenga.

const hasRole = (user, roles) => {
  const dictionary = {
    player: 1,
    admin: 2,
    fiscal: 3,
    dropper: 4,
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
