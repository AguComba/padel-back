---
name: tests
description: Convenciones para escribir o modificar tests en padel-back (Vitest). Usala siempre que haya que crear, editar o revisar un archivo en tests/, o cuando se pida "testear", "agregar tests" o "cubrir" algun modulo.
---

# Tests en padel-back

El plan general de testing (fases, prioridades, que falta) esta en `TESTING.md`.
Esta skill define **como** se escribe cada test. Si una regla de aca choca con
un test existente, manda la skill: se corrige el test.

## 1. Patron AAA (obligatorio)

Todo test tiene tres bloques, **en este orden**, separados por **una linea en blanco**
y sin comentarios `// Arrange`, `// Act` ni `// Assert`:

1. **Arrange**: se preparan los datos de entrada, el resultado esperado y los mocks.
2. **Act**: una sola llamada a lo que se esta testeando, y el resultado se guarda en una variable con nombre.
3. **Assert**: los `expect` sobre esa variable, o sobre los mocks.

```js
it('dado 3 parejas, arma una sola zona de 3', () => {
    const esperado = { zonasDe3: 1, zonasDe4: 0, totalZonas: 1 }

    const zonas = calcularZonas(3)

    expect(zonas).toEqual(esperado)
})
```

Reglas:
- **No se llama a la funcion adentro del `expect`.** Esta mal `expect(calcularZonas(3)).toEqual(...)`.
- **Hay un solo Act por test.** Si hacen falta dos llamadas para probar dos casos, son dos tests, o un `it.each`.
- **No van loops ni condicionales** (`for`, `if`, `continue`) adentro de un test. Para recorrer varios casos se usa `it.each`, con los casos armados fuera del `it`.
- Los valores que se comparan se nombran en el Arrange (`esperado`, `usuario`, `partidos`), en lugar de escribirlos sueltos en el `expect`.
- El Arrange puede quedar vacio si no hay nada que preparar. En ese caso el test tiene solo Act y Assert, separados por una linea en blanco.
- Un test con `async` sigue el mismo formato: el `await` va en el Act.

### Con `it.each`

Cada fila trae la entrada y lo esperado, y el cuerpo del test respeta el AAA:

```js
it.each([
    [12, { zonasDe3: 4, zonasDe4: 0, totalZonas: 4 }],
    [13, { zonasDe3: 3, zonasDe4: 1, totalZonas: 4 }]
])('dado %i parejas, reparte el resto en zonas de 4', (parejas, esperado) => {
    const zonas = calcularZonas(parejas)

    expect(zonas).toEqual(esperado)
})
```

### Con mocks

Configurar el mock (`mockResolvedValueOnce`, etc.) es parte del **Arrange**:

```js
it('dado un pago de INSCRIPCION, arma el transaction_id con el sufijo I', async() => {
    vi.mocked(executeQuery)
        .mockResolvedValueOnce({ insertId: 42 })
        .mockResolvedValueOnce(undefined)

    const transactionId = await PaymentModel.create(basePayment)

    expect(transactionId).toBe('00000042I')
})
```

## 2. Nombres

- `describe('<Modulo> - <funcion>', ...)`, por ejemplo `'Zone logic - calcularZonas'`.
- `it('dado <situacion>, <resultado esperado>', ...)`, en español, sin tildes ni eñes.
- Si el test fija un comportamiento que es un bug conocido, el nombre termina en `(comportamiento actual)`.

## 3. Estructura y dependencias

- Los tests van en `tests/`, espejando la ruta del codigo: `modules/Zones/zone.logic.js` se testea en `tests/modules/Zones/zone.logic.test.js`.
- Las funciones de Vitest se importan explicitamente (`import { describe, it, expect, vi } from 'vitest'`). No se usa `globals`.
- **Ningun test toca MySQL.** Los modelos y `utils/executeQuery.js` se mockean con `vi.mock()` arriba de todo, y se resetean en `beforeEach` con `vi.mocked(fn).mockReset()`.
- En Results se aprovecha la inyeccion de dependencias: se le pasa un repositorio falso al use-case y no hace falta `vi.mock`.
- Hay que reutilizar los helpers en lugar de armar objetos a mano:
  - `tests/helpers/auth.js`: `buildUser({ role })`, `signToken`, `authCookie`, `ROLES`.
  - `tests/helpers/http.js`: `mockReq({ body, query, params, user })` y `mockRes()`.
- Los datos base que se repiten en varios tests van en una constante al principio del archivo (por ejemplo, `basePayment`), y cada test los ajusta con spread.

## 4. Bugs que aparecen al testear

- **No se corrige codigo de produccion por iniciativa propia.** Se escribe un test que fija el comportamiento actual, arriba se agrega un comentario `// BUG: <que pasa>`, y se le avisa al usuario para que decida cual es el comportamiento correcto.
- Las inconsistencias menores, que no son bugs (por ejemplo, devolver un string en vez de lanzar un error), se marcan con `// Inconsistencia: <que pasa>`.
- Si el usuario decide corregirlo, primero se cambia el test para que exprese el comportamiento correcto, se verifica que falla, y recien despues se toca el codigo.

## 5. Estilo

- StandardJS con **4 espacios** de indentacion, sin `;`, con comillas simples.
- Sin espacio entre `async` y los parentesis: `async() => {}`.

## 6. Antes de terminar

```bash
npm test
```

La suite completa tiene que quedar en verde. Al usuario se le informan la cantidad de tests nuevos y cualquier bug o inconsistencia que se haya encontrado.
