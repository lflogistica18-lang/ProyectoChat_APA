# 🍱 ProyectoChat APA — Gastro Viandas

> Plataforma digital para la venta de viandas y servicios gastronómicos.
> Compuesta por un chatbot inteligente (WhatsApp), una landing page, un formulario de pedidos y un sistema de historias/promociones.
> **Marzo 2026**

---

## 🏗️ Guía de Arquitectura (OBLIGATORIO LEER)

Para evitar el "código espagueti" y mantener el proyecto escalable, todas las nuevas funcionalidades **deben** respetar la siguiente estructura. Antes de crear un archivo nuevo, ubícalo en una de estas categorías:

```text
ProyectoChat_APA/
│
├── index.html                         ← ✨ NUEVO: Página principal (Entry point)
├── menu.html                          ← ✨ NUEVO: Catálogo de viandas
├── admin/                             ← Panel de control visual (CMS)
├── data/                              ← Datos dinámicos (landing.json)
├── Imagenes/                          ← Activos (Logo, fotos, etc)
├── css/                               ← Estilos
├── js/                                ← Lógica modularizada
│
├── workflows/                         ← Flujos exportados de n8n
│   ├── flujo_viandas_sin_telegram.json
│   └── flujo_formulario_web.json
│
└── docs/                              ← Documentación técnica
    ├── README_chatbot_viandas.md
    ├── README_landing_viandas.md
    └── ...
```

### 💡 Reglas de Oro para Nuevos Archivos

1. **Aislar por Funcionalidad (Feature-based)**:
   Si vas a crear el **Formulario**, no pongas su lógica Javascript dentro de un archivo `main.js` gigante. Crea un archivo dentro de `frontend/js/forms/`. 

2. **Reutilizar Componentes**:
   Si el chat y el formulario utilizan los mismos botones y tarjetas visuales, el CSS debe ir en `frontend/css/` o en clases utilitarias compartidas, no hardcodeado en cada HTML.

3. **Limpio y accesible**:
   La raíz del proyecto contiene el `index.html` para que GitHub Pages o cualquier servidor web lo detecte automáticamente sin redirecciones.

---

## 🤖 Subproyecto 1 — Chatbot WhatsApp

**Qué es:** Bot de ventas inteligente que opera 24/7 en WhatsApp Business.
**Documentación:** [docs/README_chatbot_viandas.md](docs/README_chatbot_viandas.md)

---

## 🌐 Subproyecto 2 — App Web (Landing + Chat Web + Historial)

**Qué es:** Aplicación web pública para interactuar con clientes, mostrar el menú y permitir subir dinámicas (historias) y recoger información del cliente mediante formularios.
**Documentación:** [docs/README_landing_viandas.md](docs/README_landing_viandas.md)

---

## 🔗 Cómo se conectan los dos subproyectos

1. **Visitante en la web** completa o toca "WhatsApp". 
2. **Entra al Chatbot (n8n)** y es gestionado por la inteligencia artificial.
3. Se guarda en **Google Sheets** o base de datos.
4. El nuevo sistema de **Formularios** de la web enviará datos por medio de API (fetch) hacia el webhook de n8n para que procese pedidos o quejas.

---

## 📋 Estado general del proyecto

| Componente | Estado | Prioridad |
|------------|--------|-----------|
| Chatbot WhatsApp v3.0 | ✅ Funcionando | — |
| Nueva Estructura Modular | ✅ Lista | — |
| Web Chat UI | ⏳ En desarrollo | Alta |
| Formularios Interactivos | ✅ Listo | — |
| Landing — Contenido dinámico (JSON) | ✅ Listo | — |
| Panel Administrador (CMS) | ✅ Listo | — |
| Subida de Historias Web | ⏳ Planificado | Alta |
| Base de conocimiento (Sheets) | ⏳ Pendiente | Alta |
| Dashboard Looker Studio | 📅 Futuro | Baja |

---

*Agencia IA — Arquitecto Senior + Especialista en Datos + Experto en n8n*
*ProyectoChat_APA — Marzo 2026*

---

### 🌐 Webhooks de Producción (Configurados en n8n-prod-lucas.duckdns.org)
- **Lead Form:** `https://n8n-prod-lucas.duckdns.org/webhook/lead-web`
- **Chat Widget:** `https://n8n-prod-lucas.duckdns.org/webhook/whatsapp-viandas`
- **Generador Historias:** `https://n8n-prod-lucas.duckdns.org/webhook/generar-historias`


