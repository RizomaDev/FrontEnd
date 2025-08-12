# 🌿 Rizoma - Otra Málaga

Rizoma es una aplicación web que permite descubrir y compartir lugares únicos y experiencias auténticas. La plataforma conecta a los usuarios con espacios culturales, artísticos y sociales que representan la verdadera esencia de la ciudad.

## 🌟 Características Principales

- **Descubrimiento de Lugares**
  - Exploración interactiva a través de mapas
  - Búsqueda y filtrado por categorías
  - Detalles completos de cada ubicación

- **Gestión de Marcadores**
  - Crear y compartir nuevos lugares
  - Añadir fotos y descripciones detalladas
  - Categorización por tipos de espacios
  - Geolocalización precisa

- **Experiencia de Usuario**
  - Interfaz intuitiva y moderna
  - Diseño responsive para todos los dispositivos
  - Sistema de autenticación seguro
  - Búsqueda avanzada de lugares

## 🛠 Stack Tecnológico

### Frontend
- React.js + Vite
- React Router para navegación
- Leaflet para mapas interactivos
- Tailwind CSS + DaisyUI para estilos
- Cloudinary para gestión de imágenes

### Backend
- Spring Boot
- PostgreSQL
- JWT para autenticación
- API RESTful

## 🚀 Inicio Rápido

### Prerrequisitos
- Node.js (v18 o superior)
- npm o yarn

### Instalación

1. Clonar el repositorio:
\`\`\`bash
git clone https://github.com/RizomaDev/FrontEnd.git
\`\`\`

2. Instalar dependencias:
\`\`\`bash
cd FrontEnd
npm install
\`\`\`

3. Configurar variables de entorno:
Crear archivo \`.env\` con:
\`\`\`
VITE_API_URL=http://localhost:8080/api
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_API_KEY=tu_api_key
VITE_CLOUDINARY_API_SECRET=tu_api_secret
\`\`\`

4. Iniciar el servidor de desarrollo:
\`\`\`bash
npm run dev
\`\`\`

## 📝 Scripts Disponibles

- \`npm run dev\` - Inicia el servidor de desarrollo
- \`npm run build\` - Construye la aplicación para producción
- \`npm run preview\` - Vista previa de la build de producción
- \`npm run lint\` - Ejecuta el linter

## 📁 Estructura del Proyecto

\`\`\`
FrontEnd/
├── src/
│   ├── assets/          # Recursos estáticos
│   ├── components/      # Componentes reutilizables
│   ├── config/          # Configuraciones
│   ├── context/         # Contextos de React
│   ├── hooks/           # Hooks personalizados
│   ├── pages/           # Componentes de páginas
│   ├── service/         # Servicios y API
│   └── utils/           # Utilidades
\`\`\`

## 🌐 Despliegue

### Frontend (Netlify)
1. Conectar con repositorio de GitHub
2. Configurar variables de entorno
3. Build command: \`npm run build\`
4. Publish directory: \`dist\`

### Backend (Railway)
1. Configurar base de datos PostgreSQL
2. Establecer variables de entorno
3. Conectar con repositorio de GitHub

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama de feature (\`git checkout -b feature/NuevaCaracteristica\`)
3. Commit de cambios (\`git commit -m 'Añade nueva característica'\`)
4. Push a la rama (\`git push origin feature/NuevaCaracteristica\`)
5. Crear Pull Request

## 👥 Equipo

- **Larissa Saud** - Desarrollador Full Stack
  - [GitHub](https://github.com/saudlari)
  - [LinkedIn](https://www.linkedin.com/in/larissasaud)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- [DaisyUI](https://daisyui.com/) por los componentes de UI
- [Leaflet](https://leafletjs.com/) por la integración de mapas
- [Cloudinary](https://cloudinary.com/) por el manejo de imágenes
- [Railway](https://railway.app/) por el hosting del backend
- [Netlify](https://www.netlify.com/) por el hosting del frontend