# 📱 iPhone Stock Manager

Sistema de gestión de inventario profesional para la administración de stock de iPhones a través de múltiples sucursales. Diseñado para ser rápido, seguro y con cálculos de precios automatizados.

## 🚀 Características Principales

- **Gestión Multi-Sucursal:** Control de stock dividido en 4 sucursales estratégicas:
  - Abasto Fix (FX01)
  - Swop Tech (SWP13)
  - Abasto 2 (IC01) - Arriba
  - Abasto 1 (IC02) - Abajo
- **Cálculos Automáticos:** El sistema calcula dinámicamente:
  - Precio Contado (15% OFF)
  - Descuentos Especiales (OFF1: -$20,000 / OFF2: -$40,000)
  - Financiación (Planes de 3 y 6 cuotas)
- **Control de Estado:** Seguimiento detallado de salud de batería (Original vs Nueva) y registro de IMEI.
- **Seguridad por Roles:**
  - **Admin:** Acceso total (Crear, Editar, Eliminar).
  - **Viewer:** Modo consulta (Solo lectura).
- **Interfaz Moderna:** Diseño basado en una paleta de grises profesional con Tailwind CSS y Next.js 16.

## 🛠️ Stack Tecnológico

- **Frontend:** [Next.js 16](https://nextjs.org/) (App Router)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Sesiones:** [Iron Session](https://github.com/vvo/iron-session)
- **Iconos:** [Lucide React](https://lucide.dev/)

## ⚙️ Configuración del Entorno

Para ejecutar este proyecto localmente, asegúrate de tener instalados Node.js y Docker.

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd app-iphones-stock
   ```

2. **Configurar variables de entorno:**
   Crea un archivo `.env` en la raíz con el siguiente formato:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/iphone_stock?schema=public"
   
   ADMIN_PASSWORD="tu_clave_admin"
   VIEWER_PASSWORD="tu_clave_viewer"
   SESSION_PASSWORD="clave_secreta_de_32_caracteres_minimo"
   ```

3. **Levantar la Base de Datos:**
   ```bash
   docker compose up -d
   ```

4. **Instalar dependencias:**
   ```bash
   npm install
   ```

5. **Preparar la Base de Datos:**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

6. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

## 📂 Estructura del Proyecto

- `src/app/`: Rutas y páginas principales.
- `src/components/`: Componentes de interfaz (Dashboard, Formularios).
- `src/lib/`: Lógica de servidor, acciones, tipos y utilidades de Prisma/Sesión.
- `src/proxy.ts`: Middleware de seguridad y protección de rutas (Convención Next.js 16).
- `prisma/`: Esquema de base de datos y scripts de inicialización (Seed).

## 🔒 Seguridad

El sistema utiliza la convención `proxy.ts` de Next.js 16 para asegurar que solo usuarios autenticados puedan acceder al dashboard. Las sesiones están encriptadas y las contraseñas se gestionan de forma segura a través de variables de entorno.

---
Desarrollado para la gestión eficiente de stock de dispositivos Apple.
