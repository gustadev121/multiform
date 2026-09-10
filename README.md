# Multiform Monorepo ⚡

Monorepo de desarrollo y distribución de la librería **Multiform** para formularios declarativos basados en shadcn/ui.

## 📁 Estructura del Monorepo

- `packages/multiform`: Paquete central publicado en NPM.
- `apps/playground`: Entorno de desarrollo y playground interactivo en Vite + React con componentes locales de shadcn/ui.

## 🛠️ Herramientas

- **Runtime & Gestor de Paquetes:** [Bun](https://bun.sh)
- **Monorepo Build System:** [Turborepo](https://turbo.build)
- **Linter & Formatter:** [Biome](https://biomejs.dev)
- **Versionado Semántico & Releases:** [Changesets](https://github.com/changesets/changesets) + GitHub Actions

## 🚦 Comandos Disponibles

```bash
bun install             # Instala dependencias en todo el monorepo
bun run dev             # Inicia el playground en http://localhost:5173
bun run build           # Compila paquetes con Turborepo
bun run test            # Ejecuta pruebas unitarias con Bun test
bun run lint            # Ejecuta verificación de código con Biome
bun run lint:fix        # Aplica correcciones automáticas de Biome
bun run changeset       # Registra un nuevo cambio de versión
```
