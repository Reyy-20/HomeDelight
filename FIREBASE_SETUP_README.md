# 🚀 Sistema de Login y Registro con Firebase - HomeDelight

## 📋 Descripción

Este sistema implementa un completo sistema de autenticación y gestión de usuarios para HomeDelight, conectado a Firebase Firestore en el proyecto **"Expo Project Senior"**.

## ✨ Características Implementadas

### 🔐 Sistema de Autenticación
- **Login y Registro de Clientes**: Formulario completo con validaciones
- **Login y Registro de Negocios**: Formulario empresarial con campos adicionales
- **Autenticación Firebase**: Integración completa con Firebase Auth
- **Gestión de Sesiones**: Almacenamiento local y verificación de estado

### 🗄️ Base de Datos Firestore
- **Colección `users`**: Almacena información de todos los usuarios
- **Tipos de Usuario**: Cliente, Negocio, Administrador
- **Estados de Cuenta**: Activo, Pendiente, Rechazado
- **Timestamps**: Creación, último login, aprobación

### 📊 Panel de Administración
- **Dashboard en Tiempo Real**: Estadísticas de usuarios
- **Gráficos Interactivos**: Distribución y actividad de usuarios
- **Gestión de Negocios**: Aprobación/rechazo de registros empresariales
- **Monitoreo de Actividad**: Seguimiento de logins y registros

### 🎨 Interfaz de Usuario
- **Diseño Responsivo**: Adaptable a todos los dispositivos
- **Tema Dorado**: Consistente con la identidad de HomeDelight
- **Animaciones Suaves**: Transiciones y efectos visuales
- **Validaciones en Tiempo Real**: Feedback inmediato al usuario

## 🛠️ Configuración de Firebase

### 1. Proyecto Firebase
- **Nombre**: Expo Project Senior
- **ID**: expo-project-senior-6bfea
- **Dominio**: expo-project-senior-6bfea.firebaseapp.com

### 2. Servicios Habilitados
- ✅ **Authentication**: Email/Password
- ✅ **Firestore Database**: Base de datos NoSQL
- ✅ **Hosting**: Alojamiento web (opcional)

### 3. Reglas de Seguridad Firestore
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios pueden leer/escribir su propio documento
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Administradores pueden acceder a todos los usuarios
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.userType == 'admin';
    }
  }
}
```

## 📁 Estructura de Archivos

```
HomeDelight/
├── public/
│   ├── login&register2.html          # Página principal de login/registro
│   ├── admin-dashboard.html          # Panel de administración
│   ├── js/
│   │   ├── firebase-config.js        # Configuración de Firebase
│   │   └── auth-manager.js           # Lógica de autenticación
│   └── css/
│       └── style.css                 # Estilos principales
└── FIREBASE_SETUP_README.md          # Este archivo
```

## 🚀 Instalación y Uso

### 1. Configuración Inicial
```bash
# Clonar o descargar el proyecto
# Asegurarse de que Firebase esté configurado en firebase-config.js
```

### 2. Dependencias
- Firebase SDK (incluido via CDN)
- Chart.js para gráficos (incluido via CDN)

### 3. Ejecutar
```bash
# Abrir login&register2.html en un servidor web
# Para desarrollo local, usar Live Server o similar
```

## 🔧 Funcionalidades del Sistema

### Cliente
- **Registro**: Nombre, email, contraseña, teléfono
- **Login**: Email y contraseña
- **Estado**: Activo automáticamente

### Negocio
- **Registro**: Nombre del negocio, email, contraseña, teléfono, dirección, licencia
- **Login**: Email y contraseña
- **Estado**: Pendiente de aprobación por administrador

### Administrador
- **Acceso**: Solo usuarios con tipo 'admin'
- **Funciones**: Aprobar/rechazar negocios, ver estadísticas, monitorear actividad

## 📊 Estructura de la Base de Datos

### Colección: `users`
```javascript
{
  uid: "string",                    // ID único de Firebase Auth
  email: "string",                  // Email del usuario
  userType: "client|business|admin", // Tipo de usuario
  status: "active|pending|rejected", // Estado de la cuenta
  
  // Campos específicos de cliente
  name: "string",                   // Nombre completo
  phone: "string",                  // Teléfono
  
  // Campos específicos de negocio
  businessName: "string",           // Nombre del negocio
  address: "string",                // Dirección
  license: "string",                // Número de licencia
  
  // Timestamps
  createdAt: "timestamp",           // Fecha de creación
  lastLogin: "timestamp",           // Último login
  approvedAt: "timestamp",          // Fecha de aprobación (negocios)
  approvedBy: "string"              // ID del administrador que aprobó
}
```

## 🔒 Seguridad y Validaciones

### Validaciones del Cliente
- Email válido
- Contraseña mínima 6 caracteres
- Campos obligatorios completos

### Validaciones del Negocio
- Todos los campos obligatorios
- Verificación de tipo de usuario
- Estado pendiente hasta aprobación

### Seguridad Firebase
- Autenticación por email/contraseña
- Reglas de Firestore para acceso controlado
- Verificación de tipo de usuario en cada operación

## 📱 Responsive Design

- **Desktop**: Layout completo con gráficos y tablas
- **Tablet**: Adaptación de columnas y tamaños
- **Mobile**: Stack vertical y navegación optimizada

## 🎯 Monitoreo y Analytics

### Métricas Disponibles
- Total de usuarios registrados
- Distribución por tipo (cliente/negocio)
- Negocios pendientes de aprobación
- Actividad de login por día
- Historial de aprobaciones/rechazos

### Dashboard en Tiempo Real
- Actualización automática de estadísticas
- Gráficos interactivos con Chart.js
- Filtros por tipo de usuario y estado
- Tablas con datos actualizados

## 🚨 Solución de Problemas

### Error: "Firebase no está disponible"
- Verificar que los scripts de Firebase estén cargados
- Comprobar la configuración en firebase-config.js

### Error: "Acceso denegado"
- Verificar reglas de Firestore
- Comprobar que el usuario tenga permisos adecuados

### Error: "Usuario no encontrado"
- Verificar que el email esté registrado
- Comprobar que el tipo de usuario sea correcto

## 🔄 Actualizaciones Futuras

### Funcionalidades Planificadas
- [ ] Recuperación de contraseña
- [ ] Verificación de email
- [ ] Login con Google/Facebook
- [ ] Notificaciones push
- [ ] Sistema de roles más granular
- [ ] Exportación de datos
- [ ] Logs de auditoría

### Mejoras Técnicas
- [ ] PWA (Progressive Web App)
- [ ] Offline support
- [ ] Caché inteligente
- [ ] Optimización de consultas
- [ ] Tests automatizados

## 📞 Soporte

Para soporte técnico o preguntas sobre la implementación:
- Revisar la consola del navegador para errores
- Verificar la configuración de Firebase
- Comprobar las reglas de seguridad de Firestore

## 📄 Licencia

Este proyecto es parte de HomeDelight y está sujeto a los términos de licencia correspondientes.

---

**Desarrollado para Expo Project Senior** 🎓  
**HomeDelight - Tu plataforma de servicios a domicilio** 🏠✨
