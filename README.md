# DIGITAL-H: Diagnóstico de Madurez Digital

Aplicación web interactiva para la medición de la madurez digital corporativa, desarrollada para integrarse en el ecosistema de **Acrux Consultores** (`acrux.life`).

La herramienta evalúa a las organizaciones en 6 dimensiones críticas:
* 🚀 Estrategia Digital
* ❤️ Cultura y Liderazgo
* 👥 Talento y Competencias
* 💻 Tecnología e Infraestructura
* 📊 Procesos y Datos
* ⭐ Experiencia y Bienestar

Permite el perfilamiento y captura de *Leads* mediante un formulario interactivo y calcula en tiempo real métricas para generar un **reporte PDF** personalizado con una Hoja de Ruta.

## Tecnologías Utilizadas
* **React 19** & **Vite**
* **Tailwind CSS v4** (Configurado con paleta cromática de Acrux: Teal & Navy)
* **Framer Motion** (Micro-animaciones UI)
* **Recharts** (Gráfica de radar para evaluación)
* **html2canvas** + **jsPDF** (Motor de exportación multipágina)
* **Firebase Firestore** (Backend BaaS para registro de leads)

## Desarrollo Local

**Requisitos previos:** Node.js instalado en tu sistema.

1. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```
2. Configurar la base de datos:
   Asegúrate de tener un archivo `.env` configurado localmente si dependes de credenciales de Firebase específicas.

3. Iniciar el entorno en vivo:
   ```bash
   npm run dev
   ```

## Despliegue Estático (Hostinger)

El entorno de Vite ha sido ajustado para trabajar con rutas relativas (`base: './'`). Esto hace que la publicación en un hosting estándar (como Hostinger) sea "Plug & Play".

1. Transpilar el código a HTML/JS/CSS limpio:
   ```bash
   npm run build
   ```
2. El sistema creará una carpeta llamada `/dist/`. Sube **todo su contenido** (no la carpeta en sí, sino lo que hay dentro) a tu administrador de archivos en la ruta que desees (por ejemplo: `/public_html/digitalh/`).
