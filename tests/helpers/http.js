import { vi } from 'vitest'

/**
 * Response de Express falso. Todos los metodos son mocks encadenables,
 * asi se puede escribir res.status(403).json({...}) y despues verificar
 * con expect(res.status).toHaveBeenCalledWith(403).
 */
export const mockRes = () => {
    const res = {}
    res.status = vi.fn(() => res)
    res.json = vi.fn(() => res)
    res.send = vi.fn(() => res)
    res.cookie = vi.fn(() => res)
    res.clearCookie = vi.fn(() => res)
    return res
}

/**
 * Request de Express falso. El usuario se pasa como `user` y queda
 * en req.session.user, que es de donde lo leen todos los controladores.
 */
export const mockReq = ({ body = {}, query = {}, params = {}, user = null, cookies = {} } = {}) => ({
    body,
    query,
    params,
    cookies,
    session: { user }
})
