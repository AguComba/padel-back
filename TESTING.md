# Plan: Implementar testing desde cero en padel-back

## Context

El proyecto no tiene ni un solo test (`npm test` sale con error). Es una API de torneos de pádel con lógica de negocio no trivial: armado de zonas, desempates, cálculo de ranking, y un flujo de pagos con Macro/PlusPagos. Los últimos commits del repo son justamente bugfixes sobre esa lógica (`empate en zona de 3`, `importRanking`, `categoria femenina`, `validacion minimo parejas`), lo cual confirma que es la zona de mayor riesgo.

**Objetivo**: montar una base de testing usable por alguien que arranca de cero, priorizando el mejor retorno por esfuerzo — primero lo que se testea sin mocks ni base de datos, después lo que necesita mocks, y al final los tests HTTP end-to-end del router.

**Decisiones tomadas**:
- Librería: **Vitest** (+ **supertest** para HTTP).
- Refactor permitido: **mínimo** — separar `app.js` de `server.js` y extraer la lógica pura de zonas. Sin cambios de comportamiento.
- Base de datos: **todo mockeado**. Ningún test toca MySQL.
- CI: fuera de alcance por ahora.

---

## Por qué Vitest

| Motivo | Detalle |
|---|---|
| ESM nativo | El proyecto es `"type": "module"`. Vitest corre ESM sin flags ni transpiladores. Jest necesita `--experimental-vm-modules`; `node:test` necesita `--experimental-test-module-mocks` para mockear módulos ESM. |
| Mocking incorporado | `vi.mock()` permite reemplazar `utils/executeQuery.js` y los modelos sin levantar MySQL. Es la pieza clave: casi todo el código está acoplado a SQL. |
| Cobertura y watch | `--coverage` (v8) y watch mode sin configurar nada. |
| Errores legibles | Diffs claros al fallar — importante cuando recién arrancás. |

Dato favorable ya verificado: `mysql.createPool()` en [config/db.config.js](config/db.config.js) es **lazy** — no abre conexión hasta el primer `getConnection()`. Importar cualquier modelo en un test es seguro.

---

## Fase 0 — Setup (30 min, sin tocar código de producción)

**Paso 0**: guardar este mismo documento en la raíz del proyecto como `TESTING.md`, para que quede versionado en el repo y sirva de guía viva mientras se avanza fase por fase.


**Instalar:**
```bash
npm i -D vitest @vitest/coverage-v8 supertest
```

**Crear `vitest.config.js`** en la raíz:
```js
import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        environment: 'node',
        include: ['tests/**/*.test.js'],
        // Se setean ANTES de que se importe config/app.config.js,
        // asi los tests no dependen del .env real.
        env: {
            SECRET_JWT_KEY: 'test-secret-key',
            MACRO_SECRET: 'test-macro-secret',
            MACRO_COMMERCE_ID: '1234',
            MACRO_FRASE: 'test-frase',
            SAMESITE: 'lax'
        },
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include: ['modules/**', 'middlewares/**', 'schemas/**', 'utils/**']
        }
    }
})
```

**Scripts en [package.json](package.json)** (reemplazar el `test` actual):
```json
"test": "vitest run",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

**Estructura**: carpeta `tests/` en la raíz espejando `modules/`. No co-locar `.test.js` junto al código, así el deploy y `npx standard` quedan limpios.

```
tests/
  helpers/
    http.js        # mockReq() / mockRes()
    auth.js        # signToken() para generar cookies válidas
  middlewares/
  schemas/
  modules/
    Zones/ Auth/ Payment/ Results/ Inscriptions/
  integration/
```

**Importante**: importar explícitamente (`import { describe, it, expect, vi } from 'vitest'`) en vez de usar `globals: true` — así `npx standard` no marca `describe`/`it` como no definidos.

**Agregar `coverage` a [.gitignore](.gitignore)**: ya está.

---

## Fase 1 — Tests unitarios de lógica pura (empezar acá)

Cero mocks, cero refactor, cero DB. Es donde vas a aprender la sintaxis y a la vez conseguir valor real.

### 1.1 `tests/middlewares/permisions.test.js`
[middlewares/permisions.js](middlewares/permisions.js) ya exporta todo y es 100% puro. El caso ideal para el primer archivo.

Cubrir: `hasRole(user, ['admin','superAdmin'])` para cada rol; `hasRole` con `user` `undefined`/`null` (usa optional chaining, debe dar `false`); `hasRole` con un rol inexistente en el diccionario (`['pepe']` → `map` da `undefined`, y **si `user.typeUser` es `undefined` el `includes` da `true`** — vale la pena fijar ese comportamiento en un test); `isPlayer`/`isAdmin`/`isFiscal`/`isDropper`/`isAcceptedUser` con los 5 valores numéricos.

### 1.2 `tests/schemas/*.test.js`
Los Zod de [schemas/](schemas/) y [modules/Results/Infrastructure/resultMatchSchema.js](modules/Results/Infrastructure/resultMatchSchema.js) ya están exportados y son puros. Testear con `.safeParse()`: caso válido, caso inválido por cada regla importante, y los defaults/coerciones.

Priorizar:
- `UserLogin` / `UserRegister` en [schemas/User.schema.js](schemas/User.schema.js) — password `min(8)`, email inválido, enums.
- `InscriptionSchema` / `inscriptionUpdateSchema` en [schemas/Inscription.schema.js](schemas/Inscription.schema.js) — `availablity_days` con valores fuera del enum, `.partial()` del update.
- `resultMatchSchema` — `wo` con `.default(0)`, `match_type` enum `zona|cuadro`, sets nullables.

> **Bug latente que estos tests van a exponer**: en [schemas/User.schema.js](schemas/User.schema.js), el schema `User` usa `z.enum('LE', 'DNI', 'CI')` y `z.enum('M', 'F', 'O')` — pasando strings sueltos en vez de un array. Zod termina tomando `'LE'` como la lista de valores, así que aceptaría `'L'` o `'E'` como documento válido. `UserRegister` lo hace bien (con array). Escribir el test, confirmar el fallo, y corregir a `z.enum(['LE','DNI','CI'])` / `z.enum(['M','F','O'])`.

### 1.3 `tests/modules/Payment/paymentModel.test.js` (formato de transaction_id)
`PaymentModel.create` en [modules/Payment/payment.model.js](modules/Payment/payment.model.js) arma el ID así: `id.toString().padStart(8,'0') + ('A' si AFILIACION, si no 'I')`. Se testea mockeando `executeQuery`:

```js
vi.mock('../../../utils/executeQuery.js', () => ({ executeQuery: vi.fn() }))
```
Casos: `insertId: 42` + `AFILIACION` → `'00000042A'`; `INSCRIPCION` → `'00000042I'`; `data.transaction_id` presente pisa a `insertId`.

---

## Fase 2 — Extraer y testear la lógica de zonas (mayor valor de negocio)

Es la lógica más compleja del sistema y hoy es **intesteable** porque vive como funciones no exportadas dentro de [modules/Zones/zone.controller.js](modules/Zones/zone.controller.js).

### 2.1 Refactor (mover, no reescribir)
Crear **`modules/Zones/zone.logic.js`** y mover ahí, exportadas y sin ningún cambio de comportamiento:

`calcularZonas`, `orderCouples`, `searchTopCouples`, `searchSecondCouples`, `searchThirdCouples`, `searchFourthCouples`, `generarZonas`, `ordenarZonasGeneradas`, `buscarPartidoEntreParejas`, `calcularEstadisticasOrdenadas`.

`zone.controller.js` pasa a importarlas. Mantener `generarZonas` y `ordenarZonasGeneradas` como `async` aunque no tengan `await` — el controlador las llama con `await` y no queremos cambiar nada más en este paso.

### 2.2 `tests/modules/Zones/zone.logic.test.js`
El archivo de tests más importante del plan.

**`calcularZonas(parejas)`**
- 3 parejas → `{ zonasDe3: 1, zonasDe4: 0, totalZonas: 1 }`.
- Casos intermedios: 12, 24, 48.
- Frontera de 49 (donde cambia el reparto de cuartas parejas).
- 64 parejas (máximo).
- `< 3` y `> 64`: **hoy devuelve un string** en vez de lanzar error, mientras que el caso de >16 zonas sí hace `throw`. Fijar el comportamiento actual en un test y anotarlo como inconsistencia a normalizar después (el string se propaga y explota con `destructuring` en `generarZonas`).

**`generarZonas(parejas)`**
- Cabeza de serie: la mejor de cada tramo va a la zona A, B, C…
- Segundas ordenadas ascendente (la peor enfrenta a la cabeza de serie), terceras descendente.
- `parejas[0].ranked === 1` dispara el `orderCouples`; si no está, respeta el orden recibido.
- La rama especial `parejas.length > 48`: las cuartas parejas se cargan desde `zonas[15]` hacia atrás. Testear con 49 y con 64 parejas — es el camino más frágil del archivo.
- Nombres de zona salen de `'ABCDEFGHIJKLMNOP'`.

**`buscarPartidoEntreParejas(matches, idA, idB)`**
- Encuentra el partido en ambos órdenes (`couple1/couple2` invertidos).
- Devuelve `null` si no existe.

**`calcularEstadisticasOrdenadas(matches)`** ← la que más bugs históricos tuvo
- Puntaje: 2 al ganador, 1 al perdedor, **0 al perdedor si `wo`**.
- Conteo de sets ganados/perdidos y games a favor/en contra; sets `null` se ignoran (partidos de 2 sets).
- `diferenciaGames` y `diferenciaSets`.
- Orden de desempate completo: puntos → diferencia de sets → diferencia de games → games a favor → **enfrentamiento directo**.
- **Zona de 3 con triple empate** (el caso del commit `2be3f3e`): armar tres parejas empatadas en todo y verificar el resultado. Ojo: `compararEnfrentamientoDirecto` como último criterio de `.sort()` **no define un orden total** (no es transitivo en un triple empate), así que el resultado puede depender del orden de entrada. El test debe documentar el comportamiento actual; si resulta inestable, es un bug real a reportar antes de tocarlo.

**`ordenarZonasGeneradas(generateds, inscriptions)`**
- Zonas con `idMatch !== null` se saltean y quedan en `zonesIgnored`.
- Asignación de slots de `parejas[0..3]` según `match === 1` / `match === 2` (incluido el corrimiento cuando aparece `couple3`).
- Acumulación de `hour` por zona.

### 2.3 `tests/modules/Zones/endZone.test.js`
`endZone` sigue en el controlador. Mockear [modules/Zones/zone.model.js](modules/Zones/zone.model.js) y [modules/Drops/drop.controller.js](modules/Drops/drop.controller.js) (`updateDropsFromZones`) y testear:
- 403 si el usuario no tiene rol `admin`/`largador`/`superAdmin`.
- 400 si falta `id_matchs`, y 400 si `getMatchsByZone` devuelve `[]`.
- El swap de la zona de 4 (`matchs.length === 4`): si el 2º perdió contra el 3º, se intercambian posiciones.
- El mapeo de `nombre` desde `coupleNamesMap`, con fallback `'SIN NOMBRE'`.

---

## Fase 3 — Use-cases y controladores con mocks

### 3.1 Results (el módulo más fácil de testear)
[modules/Results/](modules/Results/) ya usa inyección de dependencias, así que **no hace falta `vi.mock`**: se le pasa un repositorio falso al constructor.

```js
const fakeRepo = { save: vi.fn(), findAllMatchsByZone: vi.fn() }
const useCase = new RegisterResultMatch(fakeRepo)
```
Tests: `RegisterResultMatch` construye un `ResultMatch` y llama a `repo.save` con él; `GetResultsMatchsByZone` y `GetMatchsByUserLargador` lanzan `'Faltan parámetros obligatorios'` cuando falta cualquier parámetro, y delegan al repo cuando están todos; `createResultMatchService` devuelve las tres instancias cableadas.

Este módulo es el mejor ejemplo de por qué la inyección de dependencias facilita el testing — vale la pena arrancar la fase por acá.

### 3.2 Helper de request/response
`tests/helpers/http.js`:
```js
export const mockRes = () => {
    const res = {}
    res.status = vi.fn(() => res)
    res.json = vi.fn(() => res)
    res.send = vi.fn(() => res)
    res.cookie = vi.fn(() => res)
    res.clearCookie = vi.fn(() => res)
    return res
}
export const mockReq = ({ body = {}, query = {}, params = {}, user = null } = {}) =>
    ({ body, query, params, session: { user } })
```

### 3.3 Controladores prioritarios
Mockear la capa de modelos con `vi.mock` y testear **ramas de permisos y de error**, que es donde más se rompe:

- [modules/Auth/auth.controller.js](modules/Auth/auth.controller.js) → `login`: 400 con body inválido (`ValidationError`), 401 si el usuario no existe, 401 si `bcrypt.compare` da false, y en el happy path que llame a `res.cookie('access_token', ...)` con `httpOnly: true` y devuelva el objeto de `buildUserLoginResponse` (sin `password`). Mockear `AuthModel` y `bcrypt`.
- [modules/Payment/payment.controller.js](modules/Payment/payment.controller.js) → `paymentStatus`: mapeo de estado (`Estado === 'REALIZADA' && Tipo === 'PAGO'` → `status: 1`, cualquier otra combinación → `2`). Y en `payment`, que el monto se envíe en centavos (`amount * 100`) y que devuelva 401 si el usuario no está aceptado.
- [modules/Inscriptions/inscriptions.controller.js](modules/Inscriptions/inscriptions.controller.js) → `createInscriptionCouple`: tiene ~7 guardas encadenadas (no es jugador, no afiliado, no califica, ya inscripto, compañero no afiliado, compañero ya inscripto, categorías distintas). Un test por guarda, mockeando `PlayerModel`, `TournamentModel` e `InscriptionModel`.
- [modules/Ranking/ranking.controller.js](modules/Ranking/ranking.controller.js) → `importRankingFromResults`: 403 si no es admin, 400 si falta `categoria` o `id_tournament`.

> Nota sobre `RankingModel.importFromResults` ([ranking.model.js:120](modules/Ranking/ranking.model.js#L120)): tiene reglas de puntaje valiosas (`ROUND_POINTS`, `CHAMPION_POINTS`, `ZONE_POINTS`, `MIN_COUPLES_FOR_RANKING`) pero está totalmente entrelazada con `connection.query` dentro de una transacción. Testearla ahora implicaría mockear una secuencia larga y frágil de queries. **Queda fuera del alcance de esta fase**; el camino correcto es extraer después el cálculo de puntos a una función pura (`calcularPuntosPorPareja(inscriptions, dropMatches)`) y testear eso. Lo dejo anotado como paso siguiente natural, no como parte de este plan.

---

## Fase 4 — Tests de integración HTTP con supertest

### 4.1 Refactor de [app.js](app.js)
Hoy `app.js` termina con `app.listen(PORT, ...)` en el scope del módulo y **no exporta `app`**: importarlo desde un test levantaría un servidor real. Solución:

- **`app.js`**: mantiene todo lo actual (middlewares, inyección de dependencias del módulo Results, montaje de routers, handler `404`) pero **termina con `export { app }`** y **sin `listen`**.
- **`server.js`** (nuevo, 4 líneas):
  ```js
  import { app } from './app.js'
  import { PORT } from './config/app.config.js'
  app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`))
  ```
- **[package.json](package.json)**: `"main": "server.js"`, `"start": "node server.js"`, `"dev": "node --watch server.js"`.
- [start.sh](start.sh) usa `npm start`, así que **no hay que tocarlo**. No hay otras referencias a `app.js` fuera de package.json y CLAUDE.md.
- Actualizar la mención a `app.js` en [CLAUDE.md](CLAUDE.md#L77) (la inyección de dependencias sigue en `app.js`, pero conviene documentar el split).

### 4.2 Helper de autenticación
`tests/helpers/auth.js`:
```js
import jwt from 'jsonwebtoken'
export const signToken = (user) => jwt.sign(user, process.env.SECRET_JWT_KEY, { expiresIn: '4h' })
export const authCookie = (user) => [`access_token=${signToken(user)}`]
```
Funciona porque `vitest.config.js` setea `SECRET_JWT_KEY` antes de que se importe [config/app.config.js](config/app.config.js).

### 4.3 `tests/integration/*.test.js`
Con `request(app)` de supertest y los **modelos mockeados** (nada de MySQL):

- **404**: `GET /ruta-inexistente` → `404` con `{ message: 'Not found' }`.
- **`validateToken`** ([middlewares/validateToken.js](middlewares/validateToken.js)): sin cookie → **`498`** (código no estándar, vale la pena fijarlo en un test); con token inválido/expirado → `498`; con token válido → pasa y `req.session.user` queda cargado.
- **Auth**: `POST /auth/login` con body inválido → 400; credenciales malas → 401; happy path → 200 + header `Set-Cookie` con `access_token` y `HttpOnly`.
- **Rutas públicas vs privadas**: `/auth` y `/payments/estado` no exigen token; `/zones`, `/tournaments`, etc. sí.
- **Roles**: `POST /zones` con un token de `player` (`typeUser: 1`) → 403; con `admin` (`typeUser: 2`) → pasa.
- **`/result-match`**: `POST` con body que no cumple `resultMatchSchema` → 400 con el array de errores formateado; sin rol `admin/superAdmin/largador` → 403.
- **CORS** ([middlewares/cors.js](middlewares/cors.js)): origin whitelisteado pasa; sin `Origin` pasa; origin desconocido rechaza.

---

## Orden de ejecución sugerido

| # | Fase | Esfuerzo | Valor | Requiere refactor |
|---|---|---|---|---|
| 1 | Setup Vitest | 30 min | — | No |
| 2 | Permisos + Schemas (1.1, 1.2) | 2-3 h | Alto — aprendés la sintaxis y encontrás el bug de `z.enum` | No |
| 3 | Extraer + testear zone.logic (2.1, 2.2) | 1-2 días | **Máximo** — es la lógica que más se rompió | Sí (mover funciones) |
| 4 | Results use-cases (3.1) | 2 h | Medio — y enseña el patrón de DI | No |
| 5 | Controladores con mocks (3.3) | 1-2 días | Alto — cubre las guardas de permisos | No |
| 6 | Split app.js + supertest (4) | 1 día | Alto — valida el cableado real | Sí (split app/server) |

**Sobre cobertura**: no persigas 100%. Un objetivo sano para este proyecto es ~80% en `modules/Zones/zone.logic.js`, `middlewares/` y `schemas/`, y ~50% en controladores. Los modelos con SQL crudo van a quedar bajos y está bien — ese código se valida contra una DB real, no con mocks.

---

## Archivos que se crean / modifican

**Nuevos:**
- `TESTING.md` (este documento, en la raíz del proyecto)
- `vitest.config.js`
- `server.js`
- `modules/Zones/zone.logic.js`
- `tests/helpers/http.js`, `tests/helpers/auth.js`
- `tests/**/*.test.js` (según fases)

**Modificados:**
- [package.json](package.json) — devDependencies + scripts `test`/`test:watch`/`test:coverage`, `main`/`start`/`dev` apuntando a `server.js`
- [app.js](app.js) — quitar `listen`, agregar `export { app }`
- [modules/Zones/zone.controller.js](modules/Zones/zone.controller.js) — importar desde `zone.logic.js`
- [schemas/User.schema.js](schemas/User.schema.js) — corregir `z.enum` del schema `User`
- [CLAUDE.md](CLAUDE.md) — documentar el split `app.js`/`server.js` y la sección de testing

---

## Verificación

Después de cada fase:
```bash
npm test                # toda la suite, debe pasar en verde
npm run test:watch      # durante el desarrollo
npm run test:coverage   # abre coverage/index.html para ver qué falta
```

> **Nota sobre `npx standard`** (verificado el 2026-08-20): hoy **no funciona** en el repo — tira 6275 errores sobre el código ya existente. El motivo es que la configuración de estilo está en la key `eslintConfig` de [package.json](package.json), pero `standard` lee la key `"standard"`, no `eslintConfig`. Así que el `indent: 4` y el `space-before-function-paren: never` del proyecto **nunca se aplicaron**. Los archivos de test siguen el estilo real del codebase (indent 4), que es lo consistente. Arreglar la config de `standard` es un trabajo aparte, fuera del alcance de este plan.

Verificación de que el refactor no rompió nada en producción:
```bash
docker compose up -d    # MySQL en 3307
npm run dev             # tiene que arrancar igual que antes, imprimiendo el PORT
curl -i http://localhost:$PORT/ruta-inexistente   # 404 {"message":"Not found"}
curl -i http://localhost:$PORT/zones              # 498 Invalid token
```
Y un smoke test manual del flujo de zonas desde el front (generar zonas de una categoría y cerrar una zona), que es la parte que toca el refactor de `zone.logic.js`.
