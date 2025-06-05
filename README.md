# MetriTask - Gestión de Proyectos y Tareas

Aplicación web para la gestión de proyectos y tareas, desarrollada con React, TypeScript y Chakra UI.

## Características

- Gestión de proyectos y tareas
- Sistema de autenticación
- Estadísticas y métricas
- Interfaz moderna y responsiva
- Drag and Drop para tareas
- Gráficos y visualizaciones

## Requisitos Previos

- Node.js (v18 o superior)
- npm o yarn
- Git

## Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/metri-task-react.git
cd metri-task-react
```

2. Instalar dependencias:

```bash
npm install
# o
yarn install
```

3. Configurar variables de entorno:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones.

4. Iniciar el servidor de desarrollo:

```bash
npm run dev
# o
yarn dev
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run preview`: Vista previa de la versión de producción
- `npm run lint`: Ejecuta el linter

## Despliegue

### Despliegue en Vercel

1. Crea una cuenta en [Vercel](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno en el panel de Vercel
4. ¡Listo! Vercel desplegará automáticamente tu aplicación

### Variables de Entorno Requeridas

- `VITE_API_URL`: URL de la API
- `VITE_AUTH_TOKEN_KEY`: Clave para el token de autenticación
- `VITE_NODE_ENV`: Entorno de ejecución

## Tecnologías Utilizadas

- React 19
- TypeScript
- Chakra UI
- Vite
- React Router
- Recharts
- Axios
- Tailwind CSS

## Estructura del Proyecto

```
src/
  ├── components/     # Componentes reutilizables
  ├── contexts/       # Contextos de React
  ├── services/       # Servicios y llamadas a API
  ├── types/         # Definiciones de TypeScript
  ├── utils/         # Utilidades y helpers
  └── App.tsx        # Componente principal
```

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
