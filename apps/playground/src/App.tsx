import React, { useState } from "react";
import { z } from "zod";
import { AppForm } from "./lib/form";

// 1. Zod Schema for Demo 1
const userRegistrationSchema = z.object({
  fullName: z.string().min(2, "El nombre completo debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  role: z.enum(["developer", "designer", "product_manager", "qa"], {
    errorMap: () => ({ message: "Selecciona un rol válido" }),
  }),
  securityPin: z.string().length(6, "El código debe tener exactamente 6 dígitos").describe("otp"),
  bio: z.string().max(200, "Máximo 200 caracteres").describe("textarea").optional(),
  subscribeToNewsletter: z.boolean().default(true),
});

type UserRegistrationForm = z.infer<typeof userRegistrationSchema>;

// 2. Schema for Conditional Demo 3
const authSetupSchema = z.object({
  username: z.string().min(3, "Mínimo 3 caracteres"),
  authMethod: z.enum(["password", "otp_sms", "magic_link"]),
  password: z.string().min(6, "Mínimo 6 caracteres").optional(),
  phone: z.string().min(8, "Ingresa un número telefónico").optional(),
  otpCode: z.string().length(6, "El código OTP debe ser de 6 dígitos").describe("otp").optional(),
  backupEmail: z.string().email("Ingresa un correo de recuperación").optional(),
});

type AuthSetupForm = z.infer<typeof authSetupSchema>;

export function App() {
  const [activeTab, setActiveTab] = useState<"zod" | "declarative" | "conditional">("zod");
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [submitTime, setSubmitTime] = useState<string | null>(null);

  const handleSubmit = (data: any) => {
    setSubmittedData(data);
    setSubmitTime(new Date().toLocaleTimeString());
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b pb-6 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            shadcn/ui + Bun + Turborepo
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Multiform Playground
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Componentes declarativos de formularios con inferencia inteligente para shadcn/ui. Sin
            escribir manualmente Input, Select ni InputOTP.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 border-b pb-3">
          <button
            type="button"
            onClick={() => {
              setActiveTab("zod");
              setSubmittedData(null);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "zod"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-white dark:bg-slate-900 text-muted-foreground hover:text-foreground border"
            }`}
          >
            1. Inferencia por Zod (Zero-Boilerplate)
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("declarative");
              setSubmittedData(null);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "declarative"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-white dark:bg-slate-900 text-muted-foreground hover:text-foreground border"
            }`}
          >
            2. Configuración Declarativa (JSON/Array)
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("conditional");
              setSubmittedData(null);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "conditional"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-white dark:bg-slate-900 text-muted-foreground hover:text-foreground border"
            }`}
          >
            3. Campos Condicionales (showIf) & Grid
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Container */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-xl border shadow-sm">
            {activeTab === "zod" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">Registro con Inferencia Automática</h2>
                  <p className="text-xs text-muted-foreground">
                    El formulario infiere Input, Select, InputOTP, Textarea y Switch directamente
                    desde el esquema Zod.
                  </p>
                </div>

                <AppForm<UserRegistrationForm>
                  schema={userRegistrationSchema}
                  onSubmit={handleSubmit}
                  columns={2}
                  submitLabel="Crear Cuenta"
                  fieldConfig={{
                    fullName: {
                      placeholder: "Ej: Juan Pérez",
                      colSpan: 2,
                    },
                    email: {
                      placeholder: "juan@empresa.com",
                      colSpan: 1,
                    },
                    role: {
                      placeholder: "Selecciona tu especialidad",
                      colSpan: 1,
                    },
                    securityPin: {
                      label: "Código PIN de 6 Dígitos (InputOTP)",
                      description: "Ingresa el código 2FA asignado",
                      colSpan: 2,
                    },
                    bio: {
                      label: "Biografía Profesional",
                      placeholder: "Cuéntanos brevemente sobre tu experiencia...",
                      colSpan: 2,
                    },
                    subscribeToNewsletter: {
                      label: "Deseo recibir novedades y actualizaciones",
                      colSpan: 2,
                    },
                  }}
                />
              </div>
            )}

            {activeTab === "declarative" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">Definición de Campos Declarativos</h2>
                  <p className="text-xs text-muted-foreground">
                    Estructurado mediante un arreglo de campos sin requerir Zod obligatorio.
                  </p>
                </div>

                <AppForm
                  fields={[
                    {
                      name: "projectName",
                      type: "text",
                      label: "Nombre del Proyecto",
                      placeholder: "Mi nuevo SaaS",
                      required: true,
                      colSpan: 2,
                    },
                    {
                      name: "license",
                      type: "select",
                      label: "Licencia de Software",
                      required: true,
                      options: [
                        { label: "MIT License", value: "mit" },
                        { label: "Apache 2.0", value: "apache" },
                        { label: "GPL v3", value: "gpl" },
                        { label: "Propietaria", value: "proprietary" },
                      ],
                      colSpan: 1,
                    },
                    {
                      name: "releaseCode",
                      type: "otp",
                      label: "Código de Autorización (4 slots)",
                      length: 4,
                      description: "Código de 4 dígitos para firmar el release",
                      colSpan: 1,
                    },
                    {
                      name: "notes",
                      type: "textarea",
                      label: "Notas de la Versión",
                      placeholder: "Describe los principales cambios...",
                      colSpan: 2,
                    },
                    {
                      name: "isPublic",
                      type: "switch",
                      label: "Hacer repositorio público",
                      colSpan: 1,
                    },
                    {
                      name: "acceptTerms",
                      type: "checkbox",
                      label: "Confirmo los términos de publicación",
                      colSpan: 1,
                    },
                  ]}
                  columns={2}
                  submitLabel="Publicar Proyecto"
                  onSubmit={handleSubmit}
                />
              </div>
            )}

            {activeTab === "conditional" && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold">Reglas Condicionales Reactivas</h2>
                  <p className="text-xs text-muted-foreground">
                    Cambia el método de autenticación para ver cómo los campos aparecen o
                    desaparecen reactivamente usando <code>showIf</code>.
                  </p>
                </div>

                <AppForm<AuthSetupForm>
                  schema={authSetupSchema}
                  columns={2}
                  defaultValues={{
                    authMethod: "otp_sms",
                  }}
                  submitLabel="Guardar Configuración"
                  fieldConfig={{
                    username: {
                      colSpan: 2,
                      placeholder: "tu_usuario",
                    },
                    authMethod: {
                      colSpan: 2,
                      label: "Método de Autenticación Preferido",
                      options: [
                        { label: "Contraseña Clásica", value: "password" },
                        { label: "Código OTP por SMS", value: "otp_sms" },
                        { label: "Enlace Mágico al Correo", value: "magic_link" },
                      ],
                    },
                    password: {
                      type: "password",
                      label: "Contraseña Segura",
                      placeholder: "••••••••",
                      colSpan: 2,
                      showIf: (values) => values.authMethod === "password",
                    },
                    phone: {
                      type: "tel",
                      label: "Número de Teléfono Móvil",
                      placeholder: "+51 987 654 321",
                      colSpan: 1,
                      showIf: (values) => values.authMethod === "otp_sms",
                    },
                    otpCode: {
                      label: "Código OTP Recibido",
                      colSpan: 1,
                      description: "Ingresa el código de 6 dígitos",
                      showIf: (values) => values.authMethod === "otp_sms",
                    },
                    backupEmail: {
                      label: "Correo Electrónico para Magic Link",
                      placeholder: "correo@ejemplo.com",
                      colSpan: 2,
                      showIf: (values) => values.authMethod === "magic_link",
                    },
                  }}
                  onSubmit={handleSubmit}
                />
              </div>
            )}
          </div>

          {/* Results Inspector */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 rounded-xl border shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Payload Recibido en onSubmit
              </h2>
              {submitTime && (
                <span className="px-2 py-0.5 rounded text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-medium">
                  Enviado {submitTime}
                </span>
              )}
            </div>

            {submittedData ? (
              <pre className="p-4 rounded-lg bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto border border-slate-800">
                {JSON.stringify(submittedData, null, 2)}
              </pre>
            ) : (
              <div className="p-8 border border-dashed rounded-lg text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Completa los campos del formulario y presiona el botón de envío para inspeccionar
                  los datos normalizados en tiempo real.
                </p>
              </div>
            )}

            <div className="text-xs text-muted-foreground border-t pt-3 space-y-1">
              <p>• Los datos son validados contra Zod antes de emitirse.</p>
              <p>• Tipado estricto en TypeScript sin necesidad de casts manuales.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
