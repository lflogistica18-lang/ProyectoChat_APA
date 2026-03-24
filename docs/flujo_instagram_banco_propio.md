# Flujo de Publicación Automatizada en Instagram con Banco de Imágenes Propio + Gemini Pro

Este documento detalla el paso a paso lógico del flujo automatizado (n8n) utilizando **tu propio banco de imágenes (Google Drive)** y la inteligencia artificial multimodal de **Gemini Pro**.

La gran ventaja de este sistema es que tiene un costo **100% gratuito** operativamente, aprovechando al máximo tu suscripción ya activa de Gemini.

---

## 📅 Paso 1: El Disparador Diario (Schedule Trigger)
El flujo no arranca manualmente; está esperando la orden del tiempo.
- Se configura un nodo `Schedule Trigger` en n8n para que el proceso arranque, por ejemplo, **todos los días a las 18:00 hs**.
- Otra opción: un bucle donde publique 3 veces al día en horarios estratégicos (ej. 11am, 3pm, 7pm).

## 📂 Paso 2: Lectura del Banco de Imágenes (Google Drive)
En lugar de ir a robar tendencias a Instagram, n8n interactúa con tu propia bóveda de fotos.
- El nodo **Google Drive (List Files)** busca en la carpeta compartida nombrada `A_Publicar_Instagram`.
- Toma **exactamente 1 imagen** que aún no haya sido posteada y la descarga en la memoria virtual del servidor.

## 🧠 Paso 3: Análisis Visual y Redacción (🤖 Gemini Pro Vision)
Aquí entra en juego tu versión PRO de Google Gemini. Tu imagen propia es enviada por el nodo de **Google Gemini Model** hacia la API de Google con un `prompt` cuidadosamente escrito:
- *Instrucción:* "Analiza visualmente esta imagen gastronómica o técnica que pertenece a mi negocio. Observa sus detalles. Redacta un Copy (Caption) muy atractivo para Instagram orientado a ventas B2C, incluye emojis relevantes y 5 hashtags afines (#Viandas, #Saludable, etc.). Mantén el tono amable y persuasivo de nuestra marca".
- Gemini observa tu imagen y **devuelve un texto publicitario impecable**, optimizado para retención humana.

## ✨ Paso 4: Preparación del Paquete (Publicación a Facebook Graph / Instagram API)
n8n toma la foto elegida de tu Drive en el Paso 2 y el texto espectacular que le dictó Gemini en el Paso 3, y los une.
- Se envía el paquete completo a través del nodo de la **API de Instagram for Business**.
- El sistema de Meta recibe la foto y el texto, la sube al servidor (Media Upload) y le cambia el estatus a "Listo".

## 🚀 Paso 5: El Botón Final (Publicación en Red)
Casi instantáneamente, una segunda petición a la red de Meta publica (publica en el feed) el contenido cargado en el paso anterior.
- ¡Listo! Tu imagen ya se encuentra subida en Instagram, con likes y exposición en vivo.

## 🗂️ Paso 6: Organización y Limpieza
El flujo es inteligente; debe recordar qué publicó para no repetir mañana.
- El flujo localiza el archivo en Google Drive que acaba de usarse.
- Lo mueve automáticamente de la carpeta `A_Publicar_Instagram` a la carpeta de archivo histórico `Ya_Publicado_Historial`. (De esta forma nunca más se tocará).

## 📩 Paso 7: Reporte a Telegram O Slack
- Un último nodo **Telegram Bot** detecta que todo salió bien y te envía un mensaje corto a tu grupo privado: `✅ Publicación realizada con éxito a las 18:01 hs en Instagram. Foto procesada con Gemini Pro.`

---

### Lo que necesitarías configurar 1 única vez para este nodo:
1. **Credenciales de Google Drive:** Conceder permiso dentro de n8n para leer y mover archivos de una carpeta.
2. **Cuenta Business Instagram Vinculada a Facebook:** Permite publicar directo por Graph API.
3. **Credenciales de Telegram:** Para la alerta final.
4. **Token de Gemini Pro:** Solo ingresas tu API key vigente de Gemini.

*¡Súbes 50 fotos los domingos y te relajas viendo cómo n8n y Gemini manejan el marketing del mes entero en piloto automático!*
