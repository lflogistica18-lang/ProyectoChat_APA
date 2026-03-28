# ProyectoChat APA — Gastro Viandas

Landing page dinámica para un servicio de viandas gastronómicas, gestionable mediante un panel CMS y automatizada con n8n.

---

## Arquitectura

El sitio es estático pero carga sus datos dinámicamente desde archivos JSON:

- **`index.html`**: Landing principal (Hero, Servicios, Contacto).
- **`menu.html`**: Catálogo de viandas.
- **`data/landing.json`**: Fuente de verdad para todos los textos, precios e imágenes.
- **`admin/`**: Panel de control (Decap CMS).
- **`Imagenes/`**: Carpeta centralizada para imágenes.

---

## CMS en Producción (Netlify)

El CMS está hosteado en Netlify con autenticación via Netlify Identity + Git Gateway.

**URL del panel:** `https://tranquil-bunny-818c7d.netlify.app/admin/`

### Flujo automático
```
Guardás en el CMS → commit automático en GitHub → deploy en Netlify (1-2 min)
```
No se necesita tocar ninguna terminal.

### Agregar un nuevo usuario
1. Ir a Netlify → Project configuration → Identity → Invite users
2. El usuario recibe un mail y crea su contraseña
3. Listo, puede entrar al panel

---

## CMS en Local (Desarrollo)

### Paso 1 — Terminal 1: Motor del CMS
```bash
cd /home/lucas/PROYECTOS/ProyectoChat_APA
npx netlify-cms-proxy-server
```
Debe mostrar: `Netlify CMS Proxy Server listening on port 8081`

### Paso 2 — Terminal 2: Servidor web
```bash
cd /home/lucas/PROYECTOS/ProyectoChat_APA
npx http-server . --cors
```
Fijarse el puerto que muestra (por defecto 8080).

### Paso 3 — Abrir el panel
```
http://localhost:8080/admin/#local_backend=true
```
El `#local_backend=true` al final es obligatorio.

### Paso 4 — Ver los cambios en la landing
Después de guardar en el CMS, presionar **Ctrl + Shift + R** en la landing para limpiar caché.

> En local los cambios NO se suben solos a GitHub. Hay que commitear manualmente (ver abajo).

---

## Guia de Imagenes

| Concepto | Valor |
|---|---|
| Proporcion | 4:3 horizontal |
| Tamaño recomendado | 800 x 600 px |
| Peso maximo | 200 KB |
| Formato | JPEG o WebP |
| Compresion JPEG | 75-80% |

Herramienta: **squoosh.app** — subis la foto, formato MozJPEG al 78%, resize a 800 de ancho, descargás.

---

## Solución de Problemas

- **No veo los cambios en producción:** Esperá 1-2 minutos y recargá. Netlify hace el deploy automático.
- **No veo los cambios en local:** Usá Ctrl + Shift + R para limpiar caché del navegador.
- **Error de puerto:** Si `npx http-server` muestra un puerto distinto al 8080, usá ese en la URL.
- **La imagen no aparece:** Verificá que el archivo esté subido a GitHub (en local hay que commitear manualmente).

---

## Subir cambios locales a GitHub

```bash
cd /home/lucas/PROYECTOS/ProyectoChat_APA
git add .
git commit -m "descripcion del cambio"
git push origin main
```

---

## Comandos Rapidos

| Accion | Comando |
|---|---|
| Entrar a la carpeta | `cd /home/lucas/PROYECTOS/ProyectoChat_APA` |
| Motor del CMS (local) | `npx netlify-cms-proxy-server` |
| Servidor web (local) | `npx http-server . --cors` |
| Forzar actualizacion | `Ctrl + Shift + R` |

---

*Desarrollado para Gastro APA — Marzo 2026*
