# Ojo de Dios Abarrotero — Frontend

Interfaz de punto de venta e inventario construida con Next.js 16 (App Router), React 19, TypeScript y Tailwind CSS 4.

## Pantallas

| Ruta | Acceso | Descripción |
|---|---|---|
| `/login` | Pública | Inicio de sesión con correo y contraseña o con Google; recuperación de contraseña. |
| `/register` | Pública | Registrar un negocio: nombre de la tienda y la cuenta de su dueño, que queda como administrador. |
| `/reset-password` | Enlace del correo | Crear una nueva contraseña. |
| `/pos` | Sesión | Catálogo por categorías, búsqueda, lector de código de barras, ticket y cobro. |
| `/inventory` | Sesión | Indicadores, búsqueda por nombre/código/SKU, filtros de existencias y ajuste de stock. |
| `/settings` | Administrador | Empleados: alta con contraseña temporal, cambio de rol (administrador o cajero) y activar o desactivar cuentas. |
| `/` | Pública | Redirige a `/login` (o a `/pos` si ya hay sesión). |
| Cualquier otra | Pública | Página 404 con accesos al POS y al inicio de sesión. |

Los productos (`src/data/products.ts`) y los cambios de inventario o carrito todavía son datos locales de demostración.

## Autenticación

La gestionan [Supabase Auth](https://supabase.com/docs/guides/auth) y la API de NestJS:

- **Supabase** guarda las cuentas (correo y contraseña o Google), confirma correos y recupera contraseñas. La sesión vive en cookies (`@supabase/ssr`).
- **La API** (`backend/`) decide quién entra y con qué rol: una cuenta de Supabase sin perfil en el sistema no accede.
- **Registro de negocios:** cada tienda de abarrotes se registra en `/register`. La API (`POST /auth/register`) crea la cuenta del dueño ya confirmada, sin correo de confirmación, como administrador de ese negocio, y el formulario inicia la sesión. El administrador da de alta a sus empleados, cambia roles y desactiva cuentas desde Ajustes; solo ve las de su negocio. El nombre del negocio aparece en el encabezado.
- `src/proxy.ts` renueva la sesión y redirige al login las pantallas protegidas cuando no hay sesión.
- `src/components/auth/AuthProvider.tsx` abre la sesión en la API (`POST /auth/session`) antes de mostrar una pantalla protegida: recibe el perfil, el rol y el negocio. Si la cuenta está desactivada o no pertenece a ningún negocio, cierra la sesión y muestra el motivo.
- La configuración de Google (Google Cloud y Supabase) está en `backend/README.md`, sección "Inicio de sesión con Google".
- `src/app/auth/callback/route.ts` recibe a Google, la confirmación de correo y la recuperación de contraseña. Solo redirige a rutas internas.

### Variables de entorno (`frontend/.env`)

El archivo `.env` está en `.gitignore` y no se sube a git. Todas sus variables son públicas (llegan al navegador):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_API_URL=http://localhost:3001
```

| Variable | Valor |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<ref-del-proyecto>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase > Project Settings > API Keys > clave publicable (`sb_publishable_...`). **Nunca** la clave secreta. |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` |

Mientras falte la clave publicable, el login muestra un aviso en lugar del formulario. La configuración de Supabase (URLs de redirección) y de Google está en `backend/README.md`, secciones "Supabase (una sola vez)" e "Inicio de sesión con Google".

## Dispositivos compatibles

Probado de 320 px de ancho (teléfonos pequeños) a escritorio de 1920 px, incluido el teléfono en horizontal:

- **Teléfono:** catálogo en 2 columnas y barra inferior con el total y el botón Cobrar siempre visibles.
- **Teléfono en horizontal:** encabezado no fijo y navegación compacta para aprovechar la altura.
- **Tablet y escritorio:** catálogo y ticket lado a lado; el ticket queda fijo y solo su lista hace scroll, así Cobrar nunca queda oculto.
- **iPhone:** respeta el notch y la barra de inicio (`viewport-fit=cover` + `env(safe-area-inset-*)`), y los campos usan 16 px para que Safari no haga zoom al enfocarlos.
- **Pantallas táctiles:** botones de al menos 40 px.

## Iconos

Todos los iconos vienen de [Lucide](https://lucide.dev) a través de `src/components/ui/Icon.tsx`, para mantener el mismo trazo y tamaño en todas las pantallas. No se usan emojis ni símbolos tipográficos como iconos.

Para añadir un icono: impórtalo de `lucide-react` en `Icon.tsx`, agrégalo al mapa `icons` con un nombre descriptivo y úsalo con `<Icon name="nombre" />`. El logotipo (`BrandMark.tsx`) es propio y no forma parte del set.

## Requisitos

- Node.js 22.13 o superior (recomendado 24 LTS).
- pnpm 11 o superior.

El proyecto **solo** se instala con pnpm. `npm install` y `yarn` se bloquean desde el script `preinstall`.

## Desarrollo

```bash
pnpm install
pnpm dev
```

La aplicación queda en http://localhost:3000.

| Comando | Descripción |
|---|---|
| `pnpm dev` | Servidor de desarrollo con recarga en caliente. |
| `pnpm build` | Compilación de producción. |
| `pnpm start` | Sirve la compilación de producción (requiere `pnpm build`). |
| `pnpm lint` | ESLint. |
| `pnpm typecheck` | Genera los tipos de rutas y verifica TypeScript. |

Antes de integrar cambios:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm audit
```

### Junto con el backend

El backend (NestJS) escucha en http://localhost:3001 y acepta peticiones de este frontend (http://localhost:3000), así que ambos pueden correr a la vez. Para iniciar sesión, la API debe estar en marcha: `pnpm start:dev` en `backend/`.

## Estructura

```
src/
  proxy.ts        Sesión de Supabase y redirecciones de acceso
  app/
    (app)/        Pantallas con sesión: pos, inventory, settings (comparten AuthProvider)
    auth/         Callback de Supabase (Google, confirmación de correo, recuperación)
    login/, register/, reset-password/
                  Pantallas de acceso
  components/
    auth/         Formularios de acceso, botón de Google, AuthProvider
    inventory/    Tarjetas de inventario
    layout/       Encabezado (usuario y cierre de sesión) y navegación inferior
    pos/          Buscador y ticket
    settings/     Alta y lista de empleados
    ui/           Iconos, logotipos, avisos (toast) e indicadores
  data/           Catálogo de demostración
  hooks/          Lector de código de barras y avisos
  lib/            Clientes de Supabase, cliente de la API, formato, existencias
  types/          Tipos de producto, carrito y usuario
scripts/
  only-pnpm.mjs   Bloquea instalaciones con npm o yarn
```

## Seguridad

### Aplicación

`next.config.ts` configura:

- Cabeceras `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options` y `Permissions-Policy`, sin `X-Powered-By`.
- Content Security Policy en producción. `connect-src` solo permite la propia app, Supabase y la API (tomados de `.env`).
- Optimización de imágenes limitada a `lh3.googleusercontent.com/aida-public/**`, sin query strings ni redirecciones.
- Fuente autoalojada con `next/font`: el navegador no hace peticiones a Google.

### Dependencias

`pnpm-workspace.yaml` aplica estas políticas en cada instalación:

- `minimumReleaseAge`: no instala versiones publicadas hace menos de 7 días.
- `trustPolicy: no-downgrade`: bloquea versiones recientes que pierden la firma de procedencia (posible toma de control del paquete).
- `blockExoticSubdeps`: prohíbe dependencias transitivas desde git o tarballs.
- `strictDepBuilds` + `allowBuilds`: ningún script de instalación de dependencias se ejecuta sin una decisión explícita. `unrs-resolver` está denegado porque solo descarga un binario de respaldo que ya se instala según la plataforma.
- `engineStrict`: falla si la versión de Node no es compatible.

Versiona siempre `pnpm-lock.yaml` y usa `pnpm install --frozen-lockfile` en CI.
