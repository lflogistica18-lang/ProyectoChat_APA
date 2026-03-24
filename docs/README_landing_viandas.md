# 🍱 Landing Page — APA Soluciones Gastronómicas

> **Archivos HTML:** `landing_apa_viandas.html` (landing) · `menu_apa_viandas.html` (catálogo)
> **Origen:** Generado con Firebase Studio (Stitch) — separado y adaptado manualmente
> **Stack:** HTML + Tailwind CSS (CDN) — sin frameworks, sin build
> **Estado actual:** Diseño generado ✅ | Logo insertado ✅ | Contenido real ⏳ | Funcionalidad ⏳ | Publicación ⏳
> **Última actualización:** Marzo 2026

---

## 📋 Índice

1. [¿Qué es este subproyecto?](#-qué-es-este-subproyecto)
2. [Estructura de la página](#-estructura-de-la-página)
3. [Checklist de pendientes](#-checklist-de-pendientes)
4. [Cómo completar el contenido real](#-cómo-completar-el-contenido-real)
5. [Funcionalidades a implementar](#-funcionalidades-a-implementar)
6. [Seguridad básica antes de publicar](#-seguridad-básica-antes-de-publicar)
7. [Cómo publicar](#-cómo-publicar)
8. [Conexión con el Chatbot](#-conexión-con-el-chatbot)

---

## 🎯 ¿Qué es este subproyecto?

Landing page pública de **APA Soluciones Gastronómicas** — página web de captación de clientes B2C y B2B.

**Objetivo principal:** que el visitante haga click en WhatsApp y sea atendido por el bot "Gastro".

No tiene panel admin, carrito, ni pagos. La gestión de leads y stock se maneja en Google Sheets vía el chatbot de n8n.

---

## 🗂 Estructura de la página

```
/ (única página, scroll)
│
├── NAVBAR
│   └── Logo | Links nav | Botón "Pedir por WhatsApp"
│
├── HERO
│   └── Titular principal | Subtítulo | CTA "Ver el menú" + "Pedir ahora"
│       └── Foto principal del producto estrella
│
├── CÓMO FUNCIONA  (#como-funciona)
│   └── 3 pasos: Elegís → Cocinamos → Recibís
│
├── MENÚ PREVIEW  (#menu)
│   └── Filtros: Todo | Fitness | Veggie | Clásicos
│       └── 6 cards de productos con foto, nombre, descripción, precio, CTA
│
├── PARA EMPRESAS  (#empresas)
│   └── Propuesta B2B + beneficios + CTA cotización mayorista
│
├── TESTIMONIOS
│   └── 3 cards con opinión, nombre, tipo de cliente
│
├── FORMULARIO DE CONTACTO  (#contacto)
│   └── Campos: Nombre | WhatsApp | Soy (Particular/Negocio) | Zona | Mensaje
│
├── FOOTER
│   └── Logo | Links | Redes | Contacto | Copyright
│
└── BOTÓN FLOTANTE WhatsApp (siempre visible)
```

---

## ✅ Checklist de pendientes

### Contenido real
- [x] Logo insertado en navbar y footer → `Imagenes/Logo-APA-Viandas-removebg-preview.png`
- [x] Nombre de marca actualizado → "APA Soluciones Gastronómicas" en todo el HTML
- [x] Copyright actualizado → © 2026
- [ ] Reemplazar foto hero → foto real del producto estrella
- [ ] Reemplazar 6 fotos de productos → fotos reales de cada vianda
- [ ] Actualizar nombre de cada vianda
- [ ] Actualizar descripción de cada vianda
- [ ] Actualizar precios reales (actualmente tienen valores de ejemplo)
- [ ] Actualizar macros/calorías si se tienen
- [ ] Actualizar zona de entrega (actualmente: "Buenos Aires")
- [ ] Reemplazar número de WhatsApp (`5491100000000` → número real)
- [ ] Actualizar testimonios con clientes reales
- [ ] Completar datos de redes sociales (Instagram, etc.)
- [ ] Actualizar horario de atención en footer

### Funcionalidad
- [ ] Filtros del menú (tabs Todo/Fitness/Veggie/Clásicos) — JS no implementado
- [ ] Links WhatsApp con mensajes pre-cargados por contexto
- [ ] Formulario conectado a n8n o directo a WhatsApp
- [ ] Botón "Ver menú completo" → página `/menu` o scroll
- [ ] Smooth scroll en links de navbar

### Seguridad
- [ ] Honeypot anti-spam en formulario
- [ ] Rate limiting (vía Vercel headers)
- [ ] CSP básico en headers
- [ ] Sanitización de inputs del formulario

### Publicación
- [x] Archivos `.html` creados y separados (`landing_apa_viandas.html` + `menu_apa_viandas.html`)
- [ ] Subir a repositorio GitHub
- [ ] Conectar con Vercel
- [ ] Dominio propio (recomendado: `apaviandas.com.ar` en Nic.ar)

---

## 🖼 Cómo completar el contenido real

### Imágenes
Cada imagen en el código tiene dos atributos:
```html
src="URL_ACTUAL"
data-alt="descripción de qué foto va acá"
```
Reemplazar `src` con la ruta a tu imagen local o CDN.

**Tamaños recomendados:**
| Imagen | Tamaño | Ubicación en código |
|--------|--------|---------------------|
| Logo | 120×40px | Navbar + Footer |
| Hero principal | 800×600px | Sección Hero |
| Cards de producto | 400×260px | Sección Menú (×6) |
| Foto B2B | 500×400px | Sección Empresas |
| Avatares testimonios | 48×48px | Sección Testimonios |

### Textos y precios
Buscar en el código por los valores de ejemplo:
```
$5.200 / $4.800 / $6.100  → precios reales
5491100000000             → número real con código de país
Buenos Aires              → zona real de cobertura
```

### Mensajes WhatsApp pre-cargados
Actualizar los links `href="https://wa.me/..."` con:
```
Landing general:  wa.me/[NUM]?text=Hola, vi la web y quiero consultar
Desde un producto: wa.me/[NUM]?text=Hola, me interesa [NOMBRE VIANDA]
Desde B2B:        wa.me/[NUM]?text=Hola, soy [NEGOCIO] y quiero cotización
```

---

## ⚙️ Funcionalidades a implementar

### 1. Filtros del menú
```javascript
// Los botones de filtro ya están en el HTML, falta el JS:
// - Al hacer click en "Fitness" → mostrar solo cards con data-category="fitness"
// - Al hacer click en "Todo" → mostrar todas las cards
```

### 2. Formulario de contacto
**Opción A — WhatsApp directo (sin backend):**
Al hacer submit, construir URL de WhatsApp con los datos del formulario.

**Opción B — Webhook n8n (recomendado):**
Hacer POST al webhook del workflow n8n existente para que Gastro capture el lead automáticamente en Google Sheets.

### 3. Smooth scroll
El HTML ya tiene `class="scroll-smooth"` en `<html>`. Solo verificar que los `href="#seccion"` coincidan con los `id` de cada sección.

---

## 🛡 Seguridad básica antes de publicar

Sin medios de pago, el riesgo es bajo. Medidas mínimas:

| Medida | Implementación | Prioridad |
|--------|---------------|-----------|
| Honeypot anti-spam | Campo oculto en el formulario | Alta |
| HTTPS | Automático en Vercel | Alta (gratis) |
| Rate limiting | `vercel.json` con headers | Media |
| CSP básico | Meta tag en `<head>` | Media |
| Sanitización inputs | JS antes del submit | Alta |
| No exponer datos sensibles | Revisar que no haya tokens en el HTML | Alta |

---

## 🚀 Cómo publicar

### Pasos completos
```
1. ✅ Archivos HTML ya creados: landing_apa_viandas.html + menu_apa_viandas.html
2. Crear repositorio en GitHub (público o privado)
3. Subir ambos archivos + carpeta Imagenes/
4. Entrar a vercel.com → "Add New Project" → conectar GitHub
5. Deploy automático → URL gratuita: apaviandas.vercel.app
6. Comprar dominio → nic.ar (apaviandas.com.ar ~$2.000/año)
7. En Vercel → Settings → Domains → agregar dominio propio
8. Configurar DNS en Nic.ar → apuntar a Vercel
```

### Costo total estimado
| Item | Costo |
|------|-------|
| Hosting (Vercel) | $0/mes |
| Dominio .com.ar (Nic.ar) | ~$2.000/año |
| **Total** | **~$170/mes** |

### Estructura a subir a GitHub
```
/
├── landing_apa_viandas.html
├── menu_apa_viandas.html
└── Imagenes/
    └── Logo-APA-Viandas-removebg-preview.png
    └── (resto de fotos cuando estén listas)
```

---

## 🔗 Conexión con el Chatbot

La landing y el chatbot de WhatsApp se conectan de dos formas:

**1. Botón WhatsApp → dispara el bot Gastro automáticamente**
El mensaje pre-cargado que llega por WhatsApp es reconocido por el AI Agent como inicio de conversación.

**2. Formulario de contacto → webhook n8n**
Si el formulario hace POST al webhook de n8n, el lead se guarda directamente en la hoja `LEADS` de Google Sheets sin intervención manual.

Ver documentación del chatbot: `README_chatbot_viandas.md`

---

*Agencia IA — ProyectoChat_APA — Marzo 2026*
