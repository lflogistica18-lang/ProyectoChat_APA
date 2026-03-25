# 🍱 ProyectoChat APA — Gastro Viandas

Este proyecto consiste en una landing page dinámica para un servicio de viandas gastronómicas, gestionable mediante un panel administrativo (CMS) y automatizada con n8n.

---

## 🏗️ Guía de Arquitectura (Raíz)

El sitio es estático pero carga sus datos dinámicamente desde archivos JSON:
- **`index.html`**: Landing principal (Hero, Servicios, Contacto).
- **`menu.html`**: Catálogo de viandas.
- **`data/landing.json`**: Fuente de verdad para todos los textos, precios e imágenes.
- **`admin/`**: Panel de control interactivo (Decap CMS).
- **`Imagenes/`**: Carpeta centralizada para activos (Logo, fotos, etc).

---

## 🛠️ Panel Administrativo (CMS Local)

Para editar el contenido sin complicaciones de autenticación (GitHub OAuth), utilizamos el modo **Local Backend**. Sigue estos pasos para gestionar las viandas desde tu PC:

### 1. Levantar el "Motor" (Proxy de Archivos)
Abre una terminal en la carpeta del proyecto y ejecuta:
```bash
npx netlify-cms-proxy-server
```
*(Debe decir: configured with /home/lucas/PROYECTOS/ProyectoChat_APA y listening on port 8081)*

### 2. Levantar el Servidor Web
Abre una **segunda terminal** en la misma carpeta y ejecuta:
```bash
npx serve .
```
*(Esto te dará una URL local, por ejemplo: http://localhost:41237)*

### 3. Acceder al Panel
Entra en tu navegador a:
👉 **http://localhost:XXXX/admin/** (reemplaza XXXX por el puerto que te dio el comando `serve`)

Podrás editar platos, precios y fotos. Al darle a **"Save"**, los cambios se guardarán directamente en tu archivo `data/landing.json`.

---

## 🌐 Despliegue a Producción (GitHub / Hostinger)

Dado que estamos en modo local, los cambios que hagas en el panel **no se suben solos a Internet**. Para que se vean en tu web en vivo, debes hacer el proceso de Git:

1. **Guardar cambios en Git**:
   ```bash
   git add .
   git commit -m "Actualización de menú vía CMS"
   ```
2. **Subir a la nube**:
   ```bash
   git push origin main
   ```

---

## 🤖 Integraciones y Automatización (n8n)
Los formularios y el chatbot están conectados a los webhooks de producción:
- **Lead Form:** `https://n8n-prod-lucas.duckdns.org/webhook/lead-web`
- **Chat Widget:** `https://n8n-prod-lucas.duckdns.org/webhook/whatsapp-viandas`

---

*Desarrollado con ❤️ para Gastro APA — Marzo 2026*
