# 📱 iPhone Stock Manager v2

Sistema de gestión de inventario profesional para la administración de stock de iPhones a través de múltiples sucursales. Diseñado para ser rápido, seguro y con una interfaz premium adaptable.

## 🚀 Características Principales

- **Gestión Multi-Sucursal:** Control de stock dividido en 4 sucursales estratégicas con contadores dinámicos por BOX.
- **Buscador Inteligente:** Búsqueda por términos que abarca modelo, capacidad y observaciones.
- **Filtros Avanzados:** Filtrado multivariable por modelo, color, capacidad, estado de batería, descuento y precio máximo.
- **Validación de Colores:** Sistema inteligente que restringe los colores disponibles según el modelo de iPhone seleccionado (basado en especificaciones reales de Apple).
- **Modo Oscuro Premium:** Interfaz adaptable con toggle de tema (Luz/Oscuro) y persistencia de preferencia.
- **Cálculos Automáticos:** El sistema calcula dinámicamente:
  - Precio Contado (15% OFF)
  - Descuentos Especiales (OFF1: -$20,000 / OFF2: -$40,000)
  - Financiación (Planes de 3 y 6 cuotas)
- **Ordenamiento Inteligente:** Inventario ordenado automáticamente por generación de iPhone (del más nuevo al más antiguo).
- **Seguridad por Roles:**
  - **Admin:** Acceso total (Crear, Editar, Eliminar).
  - **Viewer:** Modo consulta (Solo lectura).

## 🛠️ Stack Tecnológico

- **Frontend:** [Next.js 16](https://nextjs.org/) (App Router)
- **Estilos:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Sesiones:** [Iron Session](https://github.com/vvo/iron-session)
- **Iconos:** [Lucide React](https://lucide.dev/)

## ⚙️ Configuración del Entorno

1. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/iphone_stock?schema=public"
   ADMIN_PASSWORD="tu_clave_admin"
   VIEWER_PASSWORD="tu_clave_viewer"
   SESSION_PASSWORD="clave_secreta_de_32_caracteres_minimo"
   ```

2. **Levantar y Preparar:**
   ```bash
   docker compose up -d
   npm install
   npx prisma db push
   npm run dev
   ```

## 📂 Estructura del Proyecto

- `src/app/`: Rutas y páginas principales.
- `src/components/`: Componentes de interfaz (Dashboard, Formulario, ThemeToggle).
- `src/lib/`: Lógica de servidor, acciones, tipos y constantes de modelos/colores.
- `prisma/`: Esquema de base de datos y migraciones.

---
Desarrollado para la gestión eficiente de dispositivos Apple con estándares profesionales.
