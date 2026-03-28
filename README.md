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

## 🛠️ Levantar el CMS + Sitio Local (Paso a Paso)

### Paso 1 — Abrir la primera terminal en Ubuntu

```bash
cd /home/lucas/PROYECTOS/ProyectoChat_APA
npx netlify-cms-proxy-server
```

✅ Debe mostrar: `"Netlify CMS Proxy Server listening on port 8081"`

### Paso 2 — Abrir una SEGUNDA terminal en Ubuntu

```bash
cd /home/lucas/PROYECTOS/ProyectoChat_APA
npx serve .
```

✅ **IMPORTANTE:** Prestá atención al puerto que te muestra (ej: `http://localhost:39017`). **No siempre es el 3000.**

### Paso 3 — Abrir el Panel de Administración

En el navegador ir a:

```
http://localhost:XXXX/admin/#local_backend=true
```

> ⚠️ Reemplazá `XXXX` por el puerto exacto que te dio el Paso 2. 
> El `#local_backend=true` al final es **obligatorio**.

### Paso 4 — Editar y ver los cambios

1. Editá lo que quieras en el panel y dale a **"Save"**.
2. Volvé a la pestaña de la landing (ej: `http://localhost:39017`).
3. Presioná **Ctrl + Shift + R** (esto limpia el caché y fuerza a la web a leer el nuevo JSON).

---

## 🧐 Solución de Problemas (Si no ves los cambios)

* **¿Estoy en el puerto correcto?** Si `npx serve` dice `39017` pero estás mirando `localhost:3000`, vas a ver una versión vieja o nada en absoluto.
* **¿Guardaste en el CMS?** Asegurate de que el botón cambie a "Saved" (Guardado).
* **¿Caché del navegador?** El navegador es "vago" y a veces no actualiza el archivo JSON. Usar **Ctrl + Shift + R** es la solución definitiva.
* **¿Reiniciaste los servidores?** Si hiciste cambios estructurales, a veces conviene cerrar las terminales (Ctrl+C) y volver a levantarlas.

---

## 🌐 Despliegue a Producción

Para que tus cambios locales se vean en la web real:

```bash
git add .
git commit -m "Actualización vía CMS"
git push origin main
```

---

## 📌 Comandos Rápidos

| Acción | Comando |
|---|---|
| Entrar a la carpeta | `cd /home/lucas/PROYECTOS/ProyectoChat_APA` |
| Motor del CMS | `npx netlify-cms-proxy-server` |
| Servidor Web | `npx serve .` |
| Forzar actualización | `Ctrl + Shift + R` |

---

*Desarrollado con ❤️ para Gastro APA — Marzo 2026*
