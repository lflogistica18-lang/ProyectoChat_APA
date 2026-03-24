# 🍱 Chatbot de Ventas — Viandas & Insumos Gastronómicos

> **Workflow n8n ID principal:** `Gfj08YyjUXpGdBB8`  
> **Workflow n8n TEST:** `ZgjnTDnicd2KqIjH`  
> **Versión:** 3.0 — con base de datos del negocio, manejo de errores y logs  
> **Última actualización:** Marzo 2026  
> **Zona horaria:** America/Argentina/Buenos_Aires

---

## 📋 Índice

1. [¿Qué hace este sistema?](#-qué-hace-este-sistema)
2. [Tipos de cliente](#-tipos-de-cliente)
3. [Diagrama del flujo completo](#-diagrama-del-flujo-completo)
4. [Explicación nodo por nodo](#-explicación-nodo-por-nodo)
5. [Capas de seguridad y manejo de errores](#️-capas-de-seguridad-y-manejo-de-errores)
6. [Sistema de Logs](#-sistema-de-logs)
7. [Bases de datos necesarias](#-bases-de-datos-necesarias)
8. [Base de conocimiento del negocio](#-base-de-conocimiento-del-negocio)
9. [Cómo el agente consulta los datos](#-cómo-el-agente-consulta-los-datos)
10. [Credenciales a configurar](#-credenciales-a-configurar)
11. [Estructura Google Sheets — Completa](#-estructura-google-sheets--completa)
12. [Configuración Meta WhatsApp](#-configuración-meta-whatsapp)
13. [Cómo activar el workflow](#-cómo-activar-el-workflow)
14. [Preguntas frecuentes](#-preguntas-frecuentes)
15. [Roadmap de mejoras](#-roadmap-de-mejoras)
16. [Archivos del proyecto](#-archivos-del-proyecto)

---

## 🎯 ¿Qué hace este sistema?

Un **chatbot de ventas inteligente** que opera sobre WhatsApp Business 24/7. Cuando un cliente escribe, el bot:

1. **Detecta automáticamente** si es un negocio gastronómico (B2B) o una persona particular (B2C)
2. **Conversa de forma natural** para recopilar datos de contacto e interés
3. **Consulta catálogo, precios y zonas** del negocio en tiempo real (v4.0)
4. **Registra el lead** en Google Sheets en tiempo real
5. **Alerta al equipo de ventas** por Email y Telegram instantáneamente
6. **Confirma al cliente** por email con el resumen de su consulta
7. **Registra todo** en un log de actividad para auditoría

El bot se llama **"Gastro"** y habla en español argentino.

---

## 👥 Tipos de cliente

### 🏪 B2B — Negocios Gastronómicos
Restaurantes, bares, hoteles, caterings, empresas, escuelas, hospitales, etc.

**Datos que recopila el bot:** nombre contacto, nombre/tipo negocio, zona, productos (viandas/insumos/ambos), volumen, frecuencia, email, horario para llamada.

### 👤 B2C — Personas Particulares
Personas que piden viandas para su hogar o familia.

**Datos que recopila el bot:** nombre y apellido, barrio/zona, cantidad de personas, preferencias alimentarias, frecuencia, forma de pago, email/teléfono, horario preferido de entrega.

---

## 🔄 Diagrama del flujo completo

```
👤 Cliente escribe en WhatsApp
         │
         ▼
📱 Webhook POST ──────────────────────── 🔐 Webhook GET (verificación Meta)
         │                                         │
         ▼                                         ▼
📤 Extraer Datos WA                      ✅ Devolver Challenge
(parsea JSON de Meta API)
         │
         ▼
🔍 ¿Procesar Mensaje? (es texto válido?)
    │             │
   [SÍ]         [NO] → 📋 Log No-Texto + aviso al cliente
    │
    ▼
🧠 AI Sales Agent (GPT-4o-mini)
  + 🧠 Memoria por Teléfono
  + 📊 Google Sheets Tool ← v4.0
         │
         ▼
🚨 ¿Error en AI? ──[NO]──→ 💬 Fallback → 📱 Enviar Fallback WA
         │                               ↓
        [SÍ]                    📋 Log Error AI
         │
         ▼
📱 Enviar Respuesta WA (3 reintentos)
         │
         ▼
🎯 Parsear Lead
    │             │
[Completo]   [En progreso] → flujo termina (cliente sigue chateando)
    │
    ▼
📊 Guardar Lead en Sheets ──[ERROR]──→ 📋 Log Error Sheets (CRÍTICO)
         │
         ▼
[3 acciones en paralelo]
├── 📧 Email Alerta Vendedor
├── 📱 Telegram Equipo Ventas
└── 📧 ¿Tiene Email?
     ├── [SÍ] → 📧 Email Confirmación Cliente
     └── [NO] → (fin)
```

---

## 🔍 Explicación nodo por nodo

### CAPA 1 — Entrada
| Nodo | Función |
|------|---------|
| `📱 WhatsApp Entrada` | Webhook POST. Punto de entrada, `onError: continueRegularOutput`. |
| `🔐 Verificación Meta GET` | Webhook GET solo para validar URL con Meta (una vez). |
| `✅ Devolver Challenge` | Devuelve `hub.challenge` a Meta. |

### CAPA 2 — Extracción y Validación
| Nodo | Función |
|------|---------|
| `📤 Extraer Datos WA` | Parsea JSON de Meta. Maneja: eventos no-mensaje (skip), mensajes no-texto (avida amigable). |
| `🔍 ¿Procesar Mensaje?` | Verifica `valid AND NOT skip`. |

### CAPA 3 — Inteligencia Artificial
| Nodo | Función |
|------|---------|
| `🧠 AI Sales Agent` | Detecta B2B/B2C, conversa, genera JSON del lead cuando tiene todo. |
| `🤖 GPT-4o-mini` | Modelo de lenguaje ~$0.001/1K tokens. |
| `🧠 Memoria por Teléfono` | Historial por número. Hasta 12 turnos. |
| `🚨 ¿Error en AI?` | Si `output` vacío → fallback. |

### CAPA 4 — Respuesta al Cliente
| Nodo | Función |
|------|---------|
| `📱 Enviar Respuesta WA` | Meta Graph API. **3 reintentos** con 2 seg. JSON interno removido. |
| `📱 Enviar Fallback WA` | Mensaje de disculpa si el agente falla. |

### CAPA 5 — Lead
| Nodo | Función |
|------|---------|
| `🎯 Parsear Lead` | Busca bloque JSON en respuesta del agente. |
| `✅ ¿Lead Completo?` | Verifica `lead_completo: true`. |

### CAPA 6 — Persistencia y Notificaciones
| Nodo | Función |
|------|---------|
| `📊 Guardar Lead en Sheets` | Append en hoja `LEADS`. `onError: continueErrorOutput`. |
| `📧 Email Alerta Vendedor` | Email HTML al equipo. 🔴 negocios, 🟡 particulares. |
| `📱 Telegram Equipo Ventas` | Markdown al grupo de ventas. |
| `📧 Email Confirmación Cliente` | Email HTML de confirmación. |

### CAPA 7 — Logging
| Nodo | Función |
|------|---------|
| `📋 Log Conversación` | INFO — cada mensaje procesado |
| `📋 Log Error AI` | ERROR — agente falla |
| `📋 Log Error Sheets` | CRÍTICO — lead no guardado |

---

## 🛡️ Capas de seguridad y manejo de errores

| Error | Manejo |
|-------|--------|
| JSON inválido de Meta | `try/catch` en Extraer Datos WA → flujo termina limpio |
| Mensaje no-texto | Respuesta amigable + log INFO |
| Fallo OpenAI | `onError: continueErrorOutput` → mensaje disculpa → log ERROR |
| Fallo envío WA | 3 reintentos automáticos con 2 seg de espera |
| Fallo Google Sheets | `onError: continueErrorOutput` → log CRÍTICO → email/telegram siguen |
| Fallo email/Telegram | `onError: continueRegularOutput` → el otro canal sigue funcionando |

---

## 📊 Sistema de Logs — Hoja `LOGS`

| Tipo_Evento | Nivel | Cuándo |
|-------------|-------|--------|
| `MENSAJE_PROCESADO` | INFO | Mensaje procesado OK |
| `MENSAJE_NO_TEXTO` | INFO | Audio, imagen, sticker |
| `AI_AGENT_ERROR` | ERROR | OpenAI falla |
| `LEAD_NO_GUARDADO` | CRÍTICO | Sheets rechaza el guardado |

---

## 🗄️ Bases de datos necesarias (Google Sheets)

### 📌 Estructura Actual (Mínimo Viable)
Para que el bot funcione de manera óptima en esta primera etapa, solo hacen falta las 3 hojas que ya tenés creadas. Es la base perfecta para empezar a capturar ventas sin sobrecomplicar la toma de decisiones del bot:

**1. `Leads`** — Aquí se guardan automáticamente los datos que pide el bot.
*Columnas:* `Hora y Fecha` \| `Tipo_Cliente` \| `Telefono_WA` \| `Nombre` \| `Nombre_Negocio` \| `Tipo_Local` \| `Zona` \| `Productos` \| `Volumen` \| `Frecuencia` \| `Preferencias` \| `Forma_Pago` \| `Email` \| `Horario` \| `Intencion` \| `Estado`
*Nota: El campo estado arranca en "NUEVO" y luego tus vendedores pueden cambiarlo a CERRADO o COTIZADO.*

**2. `Logs`** — Para auditar la salud del bot (errores, si no entendió, si falló WhatsApp).
*Columnas:* `Hora y Fecha` \| `Tipo_Evento` \| `Nivel` \| `Telefono` \| `Detalle`

**3. `Catalogo-Viandas`** — La base de conocimiento donde el bot consulta lo que vendés.
*Columnas:* `Categoria` \| `Descripcion/Producto` \| `Valor` \| `Macro-Nutrientres`
*(Nota: Si "Macro-Nutrientres" está vacío o en desarrollo, no pasa nada, el bot no ofrecerá este dato hasta que lo tenga).*

---

### 🚀 Estructura Futura / Recomendada (Fase 2)
Es normal no tener todavía reglas de descuentos automáticos. A medida que el volumen crezca y necesites automatizar promociones o costos de envío complejos, se recomendará sumar estas hojas para que el bot gane "inteligencia empresarial":

**`TABLA_PRECIOS_MAYORISTAS`** — Precios escalonados.
*Si de 10 a 50 viandas cuesta $6000, pero más de 50 cuesta $5500.*

**`DESCUENTOS`** — Reglas temporales.
*Ejemplo: Si te compran martes 10% off, o si tienen el cupón "LUCAS20".*

**`ZONAS_ENTREGA`** — Para cotizar envíos.
*Permite que el bot confirme si el domicilio está en rango (ej: CABA cuesta $500, GBA $1500).*

---

## 🔗 Cómo el agente consulta los datos

```
"¿Tienen sin TACC para 80 personas?"
→ Gastro usa Tool "Consultar Catálogo" → Sheets filtra productos sin TACC para B2B
→ Gastro usa Tool "Consultar Precios" → Sheets devuelve precio para 80 unidades B2B
→ "¡Sí! Para 80 personas el precio es $2.400/u. ¿Te preparo la cotización?"
```

> ⚠️ Requiere agregar nodos `Google Sheets Tool` al workflow de n8n (v4.0).

---

## 🔑 Credenciales a configurar

| Servicio | Dónde obtener | Nodo(s) en n8n |
|---|---|---|
| **OpenAI API** | platform.openai.com/api-keys | `🤖 GPT-4o-mini` |
| **Google Sheets OAuth2** | n8n → Credentials | Todos los nodos de Sheets + `TU_GOOGLE_SHEET_ID_AQUI` |
| **Gmail OAuth2** | n8n → Credentials | Email Vendedor + Email Cliente; cambiar `vendedor@tuempresa.com` |
| **Telegram Bot** | @BotFather → `/newbot` | `📱 Telegram`; reemplazar `TU_TELEGRAM_CHAT_ID` |
| **Meta WhatsApp API** | developers.facebook.com | Enviar WA; reemplazar `PHONE_NUMBER_ID` + `WHATSAPP_TOKEN` |

---

## 📊 Configuración en el Google Spreadsheet actual

1. Asegurate que tu documento de Sheets contenga exactamente las 3 pestañas: `Leads`, `Logs`, `Catalogo-Viandas`.
2. Verificá que los encabezados de las columnas coincidan con lo estructurado.
3. Copiá el ID del spreadsheet de la URL (lo que aparece entre `/d/` y `/edit`).
4. Pegá ese ID en el nodo **📊 Guardar en Google Sheets** dentro de n8n, apuntando específicamente a la hoja `Leads`.

---

## ⚙️ Configuración Meta WhatsApp

```
URL Webhook: https://TU-DOMINIO.com/webhook/whatsapp-viandas
Evento a suscribir: messages
```
Testing local: `ngrok http 5678` para exponer localhost.

---

## 🚀 Pasos para activar

1. Abrir n8n → workflow `Gfj08YyjUXpGdBB8`
2. Configurar todas las credenciales
3. Reemplazar todos los placeholders
4. Guardar → toggle **Inactive → Active**
5. Configurar webhook en Meta for Developers

---

## ❓ FAQ

**¿El bot puede inventar precios?** No. Sin base de conocimiento: "un asesor te cotiza". Con base cargada (v4.0): precio real desde Sheets.

**¿Cómo recuerda la conversación?** Memoria por número de teléfono — 12 turnos de contexto.

**¿Qué pasa si el cliente manda un audio?** Respuesta automática amigable invitando a escribir.

**¿Qué pasa si OpenAI falla?** Mensaje de disculpa al cliente + log del error. El flujo no se rompe.

---

## 🔮 Roadmap de mejoras

### ✅ v3.0 — Implementado
- [x] Bot conversacional B2B + B2C en WhatsApp
- [x] AI Agent con memoria por teléfono
- [x] Leads en Google Sheets + Alertas Email + Telegram
- [x] 6 capas de error handling
- [x] Sistema de logs (INFO/ERROR/CRÍTICO)
- [x] Workflow de testing con Chat n8n

### 🔜 v4.0 — Próximo paso
- [ ] Cargar datos del negocio en las 4 hojas de conocimiento
- [ ] Agregar `Google Sheets Tool` al AI Agent en n8n

### 📅 Futuro
| Mejora | Prioridad |
|--------|-----------|
| Google Calendar para agendar consultas | Alta |
| Dashboard Looker Studio | Media |
| Telegram Equipo Ventas | **Pendiente** (requiere configurar @BotFather) |
| Dashboard Looker Studio | Media |

---

## 📁 Archivos del proyecto

| Archivo | Descripción |
|---|---|
| `README_chatbot_viandas.md` | Este documento — guía completa |
| `estrategia_datos_chatbot.md` | Arquitectura de datos con JSON Schemas |
| **n8n ID** `Gfj08YyjUXpGdBB8` | Workflow principal (WhatsApp + Sheets + Email + Telegram) |
| **n8n ID** `ZgjnTDnicd2KqIjH` | Workflow TEST (Chat n8n interno) |

---

*Agencia IA — Arquitecto Senior + Especialista en Datos + Experto en n8n*  
*ProyectoChat_APA — Marzo 2026*
