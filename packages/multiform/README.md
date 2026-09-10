# Multiform 🚀

> **Formularios declarativos impulsados por esquemas con inferencia inteligente para shadcn/ui.**
> Olvídate de maquetar repetitivamente `Input`, `Select`, `InputOTP` o `Textarea`. Deja que el esquema infiera los controles automáticamente sin dependencias UI forzadas.

[![CI](https://github.com/gustadev121/multiform/actions/workflows/ci.yml/badge.svg)](https://github.com/gustadev121/multiform/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Bun](https://img.shields.io/badge/Bun-1.4+-black.svg)](https://bun.sh)

---

## ✨ Características

- 🧠 **Inferencia Inteligente:** Infiere campos automáticamente a partir de esquemas **Zod** (`z.string()` $\rightarrow$ Input, `z.enum()` $\rightarrow$ Select, `.describe("otp")` $\rightarrow$ InputOTP, `.describe("textarea")` $\rightarrow$ Textarea, `z.boolean()` $\rightarrow$ Switch).
- 🧩 **Arquitectura Desacoplada (Zero-Bloat):** Diseñado para consumir directamente los componentes de shadcn/ui ya instalados en tu proyecto (`@/components/ui/*`). No instala dependencias pesadas que tu proyecto no necesite.
- 📋 **Soporte Dual:** Funciona tanto con esquemas **Zod** como con definiciones **declarativas** (`fields: [...]`).
- 🔀 **Campos Condicionales Reactivos:** Muestra u oculta campos en tiempo real mediante funciones declarativas (`showIf: (values) => ...`).
- 📐 **Sistema de Cuadrícula Integrado:** Soporte nativo para responsive grid (`columns={2}`, `colSpan={2}`).
- ♿ **Accesible por Defecto:** Integración de labels accesibles, indicadores de campos requeridos y alertas de error en línea (`role="alert"`).
- ⚡ **Desarrollado con Bun, Turborepo y Biome:** Máximo rendimiento en compilación, linting y pruebas.

---

## 📦 Instalación

```bash
bun add multiform react-hook-form zod
# o con pnpm / npm:
# pnpm add multiform react-hook-form zod
# npm i multiform react-hook-form zod
```

---

## 🚀 Inicio Rápido

### 1. Conecta tus componentes de shadcn/ui una sola vez

Crea un archivo de configuración (por ejemplo `src/lib/form.ts`). Solo necesitas pasar los componentes que tengas instalados en tu proyecto:

```tsx
// src/lib/form.ts
import { createMultiForm } from "multiform";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export const Form = createMultiForm({
  components: {
    input: Input,
    select: { Select, SelectContent, SelectItem, SelectTrigger, SelectValue },
    otp: { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }, // Opcional
    textarea: Textarea,
    switch: Switch,
    checkbox: Checkbox,
    label: Label,
    button: Button,
  },
});
```

---

### 2. Uso con Inferencia Automática (Zod)

Define tu esquema Zod y renderiza el formulario en una sola línea:

```tsx
import { z } from "zod";
import { Form } from "@/lib/form";

const userSchema = z.object({
  fullName: z.string().min(2, "Ingresa tu nombre"),
  email: z.string().email("Correo inválido"),
  role: z.enum(["developer", "designer", "manager"]),
  pin: z.string().length(6).describe("otp"), // Infiere InputOTP automáticamente
  bio: z.string().max(200).describe("textarea").optional(),
  terms: z.boolean().default(false),
});

export function RegisterView() {
  return (
    <Form
      schema={userSchema}
      columns={2}
      submitLabel="Registrarse"
      onSubmit={(data) => {
        console.log("Valores validados:", data);
      }}
      fieldConfig={{
        fullName: { colSpan: 2, placeholder: "Juan Pérez" },
        pin: {
          colSpan: 2,
          description: "Código de verificación de 6 dígitos enviado por SMS",
        },
        bio: { colSpan: 2 },
        terms: { label: "Acepto los términos y condiciones", colSpan: 2 },
      }}
    />
  );
}
```

---

### 3. Uso con Definición Declarativa (Sin Zod Obligatorio)

Si prefieres estructurar tus formularios sin escribir un esquema Zod:

```tsx
import { Form } from "@/lib/form";

export function ProjectForm() {
  return (
    <Form
      fields={[
        {
          name: "projectName",
          type: "text",
          label: "Nombre del Proyecto",
          required: true,
        },
        {
          name: "license",
          type: "select",
          label: "Licencia",
          options: [
            { label: "MIT License", value: "mit" },
            { label: "Apache 2.0", value: "apache" },
          ],
        },
        {
          name: "token",
          type: "otp",
          label: "Token de Seguridad",
          length: 4,
        },
      ]}
      onSubmit={(values) => console.log(values)}
    />
  );
}
```

---

### 4. Campos Condicionales Reactivos (`showIf`)

Muestra u oculta campos reactivamente en función de los valores actuales del formulario:

```tsx
const authSchema = z.object({
  method: z.enum(["password", "otp"]),
  password: z.string().min(6).optional(),
  code: z.string().length(6).describe("otp").optional(),
});

<Form
  schema={authSchema}
  defaultValues={{ method: "password" }}
  fieldConfig={{
    password: {
      showIf: (values) => values.method === "password",
    },
    code: {
      showIf: (values) => values.method === "otp",
    },
  }}
  onSubmit={...}
/>
```

---

## 🛠️ Desarrollo y Contribución

Este proyecto utiliza **Bun workspaces** y **Turborepo**:

```bash
# Instalar dependencias
bun install

# Iniciar playground de desarrollo
bun run dev

# Ejecutar pruebas unitarias
bun run test

# Verificar linter y formato con Biome
bun run lint

# Compilar todos los paquetes
bun run build
```

---

## 📄 Licencia

MIT © gustadev121
