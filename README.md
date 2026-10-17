# Ojo de Dios Abarrotero

Interfaz de punto de venta e inventario construida con Next.js App Router, React, TypeScript y Tailwind CSS.

## Rutas

- `/login`: acceso de demostración con formulario de credenciales y teclado PIN.
- `/pos`: catálogo, búsqueda, lectura de códigos de barras y ticket interactivo.
- `/inventory`: búsqueda, filtros y ajuste local de existencias.
- `/`: redirige a `/login`.

Los productos y cambios de inventario/carrito son datos locales de demostración. La autenticación, la persistencia, el alta/edición de productos y el procesamiento de pagos requieren conectarse a sus servicios respectivos.

## Desarrollo

```bash
npm install
npm run dev
```

Verifica el proyecto antes de integrarlo con:

```bash
npm run lint
npm run build
```
