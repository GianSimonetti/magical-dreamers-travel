# Magical Dreamers Travel V2

Sitio institucional estático de Magical Dreamers Travel. La interfaz está construida con HTML, CSS y JavaScript vanilla. Los agentes y las promociones publicados se consultan desde Sanity CMS mediante su API pública.

## Requisitos

- Un navegador moderno.
- Un servidor HTTP local. No es necesario instalar dependencias del proyecto.

## Ejecutar localmente

Desde la raíz del proyecto, iniciar un servidor en el puerto `8765`:

```powershell
python -m http.server 8765 --bind 127.0.0.1
```

Luego abrir:

```text
http://localhost:8765/
```

También se puede utilizar una extensión como Live Server, configurándola para servir el proyecto desde `localhost:8765`.

## Páginas principales

- `index.html`: página institucional y formulario de contacto.
- `agentes.html`: directorio dinámico de agentes.
- `promociones.html`: promociones dinámicas con filtros Disney y Universal.
- `quiero-ser-agente.html`: información y formulario de postulación.
- `privacidad.html`: política de privacidad.
- `terminos.html`: términos y condiciones.

## Integración con Sanity

`sanity.js` contiene únicamente la configuración pública necesaria para consultar documentos publicados. No se deben agregar tokens, secretos ni credenciales al código del navegador.

Los listados muestran estados diferenciados durante la carga, cuando no hay registros activos y cuando la API no está disponible.

## Estructura pública

```text
assets/                 Imágenes y recursos visuales
index.html              Página principal
agentes.html            Directorio de agentes
promociones.html        Promociones
quiero-ser-agente.html  Postulación de agentes
styles.css              Estilos globales y responsive
script.js               Interacciones y renderizado
sanity.js               Consultas públicas a Sanity
```

## Seguridad

- No almacenar tokens de escritura o lectura autenticada en el repositorio.
- No agregar archivos `.env` al control de versiones.
- Las operaciones administrativas de Sanity se mantienen fuera del sitio público.

