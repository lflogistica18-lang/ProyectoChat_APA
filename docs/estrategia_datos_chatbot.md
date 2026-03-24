# 📊 Estrategia de Inteligencia de Datos
## Proyecto: ProyectoChat_APA — Chatbot Viandas & Insumos Gastronómicos

**Responsable:** Especialista en Datos (Agencia IA)  
**Fecha:** Marzo 2026 | **Versión:** 1.0

---

## 1. Diagnóstico de Necesidades

| Pregunta | Respuesta | Consecuencia |
|---|---|---|
| ¿Los datos son estructurados y relacionales? | ✅ SÍ | Se prioriza almacenamiento tabular |
| ¿La IA necesita consultar manuales o PDFs? | ❌ NO | No se usa RAG ni vector database |
| ¿Es un flujo simple de contacto? | ⚠️ MIXTO | Flujo de ventas con knowledge base del negocio |

**Conclusión:** Stack elegido: **Google Sheets**  
Costo $0. El cliente actualiza precios y catálogo sin código.  
Escalable a Supabase (PostgreSQL) cuando el negocio crezca.

---

## 2. Stack de Datos

| Componente | Tecnología | Justificación |
|---|---|---|
| Leads operacionales | Google Sheets — `LEADS` | Acceso del equipo de ventas, sin costo |
| Logs de actividad | Google Sheets — `LOGS` | Auditoría simple |
| Catálogo de productos | Google Sheets — `CATALOGO_PRODUCTOS` | El cliente lo actualiza sin código |
| Precios escalonados | Google Sheets — `TABLA_PRECIOS` | Fácil de actualizar ante inflación |
| Descuentos y promos | Google Sheets — `DESCUENTOS` | Activación/desactivación sin tocar el workflow |
| Zonas de entrega | Google Sheets — `ZONAS_ENTREGA` | El cliente gestiona cobertura geográfica |
| Memoria conversación | n8n memoryBufferWindow | Sesión por número de teléfono, 12 turnos |

---

## 3. Arquitectura de Conocimiento — Simple Storage (no RAG)

Se usa **Simple Storage con consulta directa** porque:
- El catálogo es un conjunto pequeño (~10-100 productos)
- Los datos son tabulares, no texto libre no estructurado
- El agente necesita **filtrar** (por tipo, zona, volumen), no buscar semánticamente

```
Usuario pregunta → AI Agent activa Tool → Google Sheets Tool filtra → AI Agent responde
```

---

## 4. Contratos de Datos (JSON Schemas)

### Lead capturado (output del AI Agent)
```json
{
  "lead_completo": true,
  "tipo_cliente": "NEGOCIO | PARTICULAR",
  "nombre": "string",
  "nombre_negocio": "string | N/A",
  "tipo_local": "restaurant | bar | hotel | catering | empresa | escuela | PARTICULAR",
  "zona": "string",
  "productos": "VIANDAS | INSUMOS | AMBOS",
  "volumen": "string",
  "frecuencia": "diaria | semanal | mensual | cada 2 días",
  "preferencias": "string | Ninguna",
  "forma_pago": "efectivo | transferencia | Mercado Pago | A coordinar",
  "email": "string | No proporcionó",
  "horario_contacto": "string",
  "intencion": "COMPRA | CONSULTA | INFO | SOPORTE"
}
```

### Row de LEADS (Google Sheets)
```json
{
  "Timestamp": "9/3/2026, 22:15:00",
  "Tipo_Cliente": "NEGOCIO | PARTICULAR",
  "Telefono_WA": "5491112345678",
  "Nombre": "string",
  "Nombre_Negocio": "string | N/A",
  "Tipo_Local": "string",
  "Zona": "string",
  "Productos": "VIANDAS | INSUMOS | AMBOS",
  "Volumen": "string",
  "Frecuencia": "string",
  "Preferencias": "string",
  "Forma_Pago": "string",
  "Email": "string",
  "Horario": "string",
  "Intencion": "string",
  "Estado": "NUEVO | EN_CONTACTO | COTIZADO | CERRADO_GANADO | CERRADO_PERDIDO"
}
```

### Row de LOGS (Google Sheets)
```json
{
  "Timestamp": "2026-03-09T22:15:00.000Z",
  "Tipo_Evento": "MENSAJE_PROCESADO | MENSAJE_NO_TEXTO | AI_AGENT_ERROR | LEAD_NO_GUARDADO",
  "Nivel": "INFO | ERROR | CRÍTICO",
  "Telefono": "5491112345678",
  "Detalle": "string (max 150 chars)"
}
```

### Row de CATALOGO_PRODUCTOS
```json
{
  "ID": "VN-001",
  "Categoria": "VIANDA_EJECUTIVA | VIANDA_ECONOMICA | INSUMO_DESCARTABLE",
  "Nombre": "string",
  "Descripcion": "string",
  "Aplica_Para": "B2B | B2C | AMBOS",
  "Ingredientes_Tipicos": "string",
  "Apto_Vegano": "SÍ | NO",
  "Apto_Sin_TACC": "SÍ | NO",
  "Activo": "SÍ | NO"
}
```

### Row de TABLA_PRECIOS
```json
{
  "ID_Producto": "VN-001",
  "Nombre_Producto": "string",
  "Tipo_Cliente": "B2B | B2C",
  "Volumen_Minimo": 1,
  "Volumen_Maximo": 49,
  "Precio_Unitario": 2800,
  "Moneda": "ARS",
  "Incluye_IVA": "SÍ | NO",
  "Vigente_Desde": "01/03/2026"
}
```

### Row de DESCUENTOS
```json
{
  "ID_Descuento": "DESC-001",
  "Nombre": "string",
  "Condicion": "string",
  "Tipo_Descuento": "PORCENTAJE | MONTO_FIJO",
  "Valor": 10,
  "Aplica_A": "TODOS | VN-001,VN-002",
  "Tipo_Cliente": "B2B | B2C | AMBOS",
  "Acumulable": "SÍ | NO",
  "Vigente_Hasta": "30/06/2026",
  "Activo": "SÍ | NO"
}
```

### Row de ZONAS_ENTREGA
```json
{
  "ID_Zona": "ZONA-CAB-01",
  "Nombre_Zona": "string",
  "Barrios_Incluidos": "Palermo, Belgrano, Núñez",
  "Dias_Entrega": "Lunes, Miércoles, Viernes",
  "Horario_Entrega": "09:00 - 13:00",
  "Pedido_Minimo_Unidades": 10,
  "Costo_Envio_B2C": 800,
  "Costo_Envio_B2B": 0,
  "Envio_Gratis_Desde": 50,
  "Activo": "SÍ | NO"
}
```

---

## 5. Seguridad y Gobernanza

| Aspecto | Política |
|---|---|
| Acceso al Sheet | Solo cuenta OAuth2 de n8n. Sheet NO público. |
| Datos personales | Emails y teléfonos solo para contacto comercial. |
| Precios | Permisos de edición restringidos al propietario del negocio. |
| Aviso de privacidad | Bot incluye: "Al continuar aceptás que usemos tus datos para contactarte." |
| Backup | Google Drive mantiene historial automático de versiones. |
| Tokens | WHATSAPP_TOKEN de Meta debe renovarse periódicamente. |

---

## Próximos Pasos

1. **Cargar datos del negocio** en las 4 hojas de conocimiento
2. **Agregar nodos `Google Sheets Tool`** al AI Agent en n8n (v4.0)
3. **Actualizar System Prompt** del agente para que sepa usar los tools
4. **Probar con workflow TEST** (Chat n8n) antes de activar en WhatsApp

---

*Agencia IA — Especialista en Datos | ProyectoChat_APA — Marzo 2026*
