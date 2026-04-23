# 🎨 Mi Portafolio

Un portafolio personal moderno construido con Next.js, React y Material-UI que muestra tus proyectos de GitHub.

## 🚀 Características

- ✨ Interfaz moderna y responsiva
- 📱 Diseño mobile-first
- 🔗 Integración con GitHub API
- 🎯 Optimizado para SEO
- 📈 Performance mejorado
- 🚀 Listo para desplegar en Vercel

## 📋 Requisitos

- Node.js 18+
- npm o yarn

## 🛠️ Instalación

1. **Clona o descarga el proyecto**
```bash
cd portafolio
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura tu usuario de GitHub**

Edita el archivo `.env.local`:
```
GITHUB_USERNAME=tu_usuario_github
```

(Opcional) Para evitar límites de la API, genera un token en [GitHub Settings](https://github.com/settings/tokens):
```
GITHUB_TOKEN=tu_token_aqui
```

4. **Inicia el servidor de desarrollo**
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🎯 Personalización

### Editar Información Personal

Edita los siguientes componentes:

- **`src/components/Hero.tsx`** - Título y descripción principal
- **`src/components/About.tsx`** - Información sobre ti y tus habilidades
- **`src/components/Footer.tsx`** - Enlaces a redes sociales

### Cambiar Colores

Modifica el tema en `src/app/layout.tsx`:
```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Cambiar este color
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
```

## 📦 Build para Producción

```bash
npm run build
npm start
```

## 🚀 Desplegar en Vercel

La forma más fácil es usar Vercel:

1. Sube tu proyecto a GitHub
2. Importa el proyecto en [Vercel](https://vercel.com)
3. Configura las variables de entorno en Vercel
4. ¡Listo! Tu portafolio estará en vivo

### Variables de Entorno en Vercel

- `GITHUB_USERNAME` - Tu usuario de GitHub (requerido)
- `GITHUB_TOKEN` - Token de GitHub (opcional)

## 📝 Estructura del Proyecto

```
src/
├── app/
│   ├── api/
│   │   └── repositories/
│   │       └── route.ts      # API para obtener repos de GitHub
│   ├── layout.tsx             # Layout principal
│   ├── page.tsx               # Página principal
│   └── globals.css            # Estilos globales
├── components/
│   ├── Header.tsx             # Encabezado
│   ├── Hero.tsx               # Sección principal
│   ├── Projects.tsx           # Galería de proyectos
│   ├── About.tsx              # Acerca de
│   └── Footer.tsx             # Pie de página
└── data/
    └── (para datos adicionales)
```

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Producción
npm start

# Lint
npm run lint
```

## 📚 Tecnologías Utilizadas

- **Next.js** 16.x - Framework React
- **React** 19 - UI library
- **TypeScript** - Lenguaje tipado
- **Material-UI** 5.x - Componentes UI
- **Axios** - HTTP client
- **GitHub API** - Para obtener repositorios

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Puedes mejorar este proyecto:

1. Agrega más secciones
2. Mejora el diseño
3. Optimiza el performance
4. Arregla bugs

## 📄 Licencia

Disponible bajo la Licencia MIT.

## 👨‍💻 Autor

Creado con ❤️ para mostrar mis proyectos

## 📞 Soporte

¿Problemas o dudas? Abre un issue o contacta directamente.

---

**¡Que disfrutes mi portafolio! 🎉**
