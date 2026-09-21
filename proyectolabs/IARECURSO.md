
# Recurso general para asistentes de IA

## Propósito: COMPOUND

Lo aprendido se deposita, no se olvida.

Este documento conserva las reglas, decisiones técnicas y conocimientos acumulados durante el desarrollo de Proyecto Labs.

Su objetivo es permitir que cualquier asistente de IA comprenda cómo está construido el sistema, cómo ejecutarlo, qué funcionalidades debe conservar y qué precauciones debe tomar antes de realizar modificaciones.

Antes de trabajar en este proyecto, revisar este documento y consultar los archivos reales del código. Si existe alguna diferencia entre la documentación y la implementación, comprobar el estado actual del proyecto antes de continuar.

---

## 1. Reglas de oro

### 1.1. El servidor no confía en la entrada

- Considerar no confiable todo dato recibido desde formularios, rutas, consultas, encabezados, archivos o servicios externos.
- Validar tipo, formato, longitud, rango y campos permitidos en el servidor antes de procesar los datos.
- Rechazar entradas inválidas con mensajes seguros y códigos HTTP apropiados.
- Utilizar consultas parametrizadas y mecanismos de protección adecuados para prevenir inyección y XSS.
- No depender exclusivamente de las validaciones realizadas en el navegador.
- No eliminar ni reducir las validaciones existentes para solucionar errores.

### 1.2. Secretos en .env, nunca en el código

- No escribir contraseñas, tokens, claves privadas ni credenciales directamente en el código, pruebas, documentación o colecciones Postman.
- Guardar las credenciales locales en archivos `.env` ignorados por Git.
- Documentar únicamente los nombres de las variables en `.env.example`, con valores vacíos o evidentemente ficticios.
- Antes de cada commit, comprobar que ningún archivo `.env` ni secreto esté incluido.
- Las variables con prefijo `VITE_` se incorporan al código del navegador y no pueden contener secretos privados.
- No copiar cadenas de conexión reales de Supabase a este documento.

### 1.3. Si se filtra una clave: revocar y rotar

1. Detener su uso y notificar a la persona responsable del servicio.
2. Revocar o desactivar la credencial comprometida.
3. Generar una credencial nueva con los permisos mínimos necesarios.
4. Actualizar los entornos autorizados sin publicar la nueva credencial en Git.
5. Revisar registros y actividad para detectar posibles usos no autorizados.
6. Coordinar la limpieza del historial de Git si la credencial fue publicada. Eliminarla del último commit no es suficiente.
7. Verificar el funcionamiento y documentar el incidente sin copiar el secreto.

---

## 2. Descripción general de Proyecto Labs

Proyecto Labs es un sistema web para consultar laboratorios y registrar reservas.

El proyecto se encuentra dentro de la carpeta `proyectolabs/` del repositorio.

Utiliza las siguientes tecnologías:

- Frontend: React y Vite.
- Backend: Node.js, TypeScript y Express.
- Validación de datos: Zod.
- Acceso a la base de datos: Prisma ORM.
- Base de datos: PostgreSQL alojada en Supabase.
- Pruebas de API: Postman.
- Control de versiones: Git y GitHub.

El backend y el frontend son aplicaciones independientes que se comunican mediante solicitudes HTTP.

Flujo general:

1. El usuario interactúa con la interfaz React.
2. React envía una solicitud HTTP al backend Express.
3. Express recibe la solicitud y ejecuta el controlador correspondiente.
4. El controlador valida los datos y utiliza Prisma Client para consultar o modificar PostgreSQL.
5. Supabase almacena la información de salas y reservas.
6. El backend devuelve una respuesta HTTP.
7. React actualiza la interfaz según el resultado.

El frontend no debe conectarse directamente a PostgreSQL ni exponer las credenciales de la base de datos.

---

## 3. Estructura principal del proyecto

La carpeta `proyectolabs/` contiene:

### Configuración general

- `package.json`: dependencias y comandos del backend.
- `package-lock.json`: versiones resueltas de las dependencias.
- `tsconfig.json`: configuración de TypeScript.
- `IARECURSO.md`: documentación Compound del proyecto.

### Base de datos

- `prisma/schema.prisma`: modelos y relaciones de la base de datos.
- `prisma/migrations/`: historial de migraciones de Prisma.

### Backend

- `src/server.ts`: configuración del servidor Express y registro de rutas.
- `src/prisma.ts`: instancia compartida de Prisma Client.
- `src/salas.controller.ts`: lógica de las operaciones sobre salas y reservas.
- `src/seguridad/env.ts`: validación de variables de entorno.
- `src/seguridad/validation.ts`: esquemas de validación con Zod.

### Frontend

La aplicación React se encuentra en `proyectolabs/frontend/`.

- `src/main.jsx`: punto de entrada de React.
- `src/App.jsx`: organización principal de la interfaz.
- `src/servicios/salasApi.js`: comunicación con el backend.
- `src/componentes/`: componentes reutilizables de la interfaz.
- `src/styles.css`: estilos generales.
- `public/identidad/`: recursos gráficos de identidad institucional.

El frontend tiene su propio `package.json` y sus propias dependencias.

No instalar las dependencias del frontend desde la carpeta raíz del repositorio.

---

## 4. Configuración inicial y ejecución

### Backend

Ubicarse en:

`proyectolabs/`

Instalar las dependencias:

```bash
npm install
```

Crear un archivo `.env` local dentro de `proyectolabs/`.

Las variables necesarias son:

```dotenv
DATABASE_URL=
DIRECT_URL=
PORT=3010
```

Los valores reales de conexión deben obtenerse de la configuración autorizada del proyecto Supabase.

No utilizar las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_KEY` del proyecto La Placita como sustitutos de las credenciales de PostgreSQL de Proyecto Labs.

El archivo `.env` no debe subirse a GitHub.

Ejecutar el backend:

```bash
npm run dev
```

El puerto predeterminado es `3010`.

### Frontend

Ubicarse en:

`proyectolabs/frontend/`

Instalar las dependencias:

```bash
npm install
```

Ejecutar:

```bash
npm run dev
```

Vite mostrará en la terminal la dirección local de la aplicación.

Para utilizar el sistema completo, el backend y el frontend deben estar ejecutándose.

### Comandos disponibles del backend

- `npm run dev`: iniciar Express en modo desarrollo.
- `npm run migrate`: ejecutar Prisma Migrate en desarrollo.
- `npm run studio`: abrir Prisma Studio.
- `npm run seed`: script preparado para ejecutar `prisma/seed.ts`.

El archivo `prisma/seed.ts` no aparece en la estructura versionada revisada. No asumir que el comando seed funciona hasta comprobar que exista su implementación.

El script `postinstall` ejecuta `prisma generate` para generar Prisma Client.

### Comandos disponibles del frontend

- `npm run dev`: iniciar Vite.
- `npm run build`: generar la compilación de producción.
- `npm run lint`: ejecutar ESLint.
- `npm run preview`: previsualizar la compilación generada.

No afirmar que estos comandos fueron ejecutados correctamente en una nueva modificación sin comprobar sus resultados.

---

## 5. Base de datos y Prisma

El archivo `prisma/schema.prisma` define los modelos Sala y Reserva.

El proyecto utiliza Prisma 6.16.2 como versión base declarada en las dependencias.

Mantener la compatibilidad entre `prisma` y `@prisma/client`. No actualizar sus versiones sin revisar los cambios de configuración y migraciones que pudiera requerir la actualización.

### Modelo Sala

Campos:

- `id`: identificador entero autoincremental y clave primaria.
- `nombre`: nombre del laboratorio.
- `edificio`: edificio donde se encuentra.
- `capacidad`: capacidad del laboratorio.
- `reservas`: relación con las reservas de la sala.

### Modelo Reserva

Campos:

- `id`: identificador entero autoincremental y clave primaria.
- `responsable`: persona responsable de la reserva.
- `motivo`: motivo de uso del laboratorio.
- `inicio`: fecha y hora de inicio.
- `fin`: fecha y hora de finalización.
- `salaId`: clave foránea que identifica la sala reservada.

### Relación entre los modelos

Una Sala puede tener muchas Reservas.

Cada Reserva pertenece a una sola Sala.

La relación utiliza `onDelete: Cascade`.

Esto significa que eliminar una sala también elimina sus reservas relacionadas.

Antes de modificar el comportamiento de eliminación, revisar las consecuencias sobre el historial de reservas.

### Conexión con Supabase

El archivo `schema.prisma` utiliza:

- `DATABASE_URL`: conexión principal de Prisma.
- `DIRECT_URL`: conexión directa configurada para las operaciones que la requieran.

La instancia de Prisma Client se encuentra en:

`src/prisma.ts`

Los controladores deben reutilizar esta instancia para acceder a la base de datos.

### Migraciones

La migración inicial se encuentra en:

`prisma/migrations/20260919175306_init/`

Esta migración crea la estructura inicial de Sala y Reserva.

No modificar manualmente una migración que ya fue aplicada en una base de datos compartida.

Si se necesita cambiar el esquema, revisar el impacto, coordinarlo con el equipo y generar una nueva migración siguiendo el procedimiento de Prisma.

No ejecutar comandos que borren, reinicien o reemplacen la base de datos compartida sin autorización explícita.

---

## 6. Backend y API

El servidor principal se encuentra en:

`src/server.ts`

Utiliza Express, habilita CORS, procesa solicitudes JSON y registra las rutas del sistema.

### Endpoints disponibles

| Método | Ruta | Función |
|---|---|---|
| GET | `/api/salas` | Consultar las salas y sus reservas. |
| POST | `/api/salas` | Crear una sala. |
| POST | `/api/salas/:id/reservas` | Crear una reserva para una sala. |
| PUT | `/api/salas/:id` | Actualizar una sala. |
| DELETE | `/api/salas/:id` | Eliminar una sala. |

La lógica de estas operaciones se encuentra en:

`src/salas.controller.ts`

Los controladores utilizan Prisma Client para acceder a PostgreSQL.

### Consulta de salas

El endpoint GET obtiene los laboratorios almacenados en la base de datos junto con sus reservas.

El frontend utiliza esta información para mostrar los laboratorios y sus datos actualizados.

No sustituir la consulta dinámica por una lista fija de laboratorios dentro del frontend.

### Creación de reservas

El endpoint POST `/api/salas/:id/reservas` recibe:

- `responsable`
- `motivo`
- `inicio`
- `fin`

El identificador de la sala se obtiene de la ruta.

Antes de crear la reserva, el backend debe validar los datos y comprobar que el horario solicitado no se traslape con otra reserva de la misma sala.

---

## 7. Validaciones y seguridad

### Variables de entorno

El archivo `src/seguridad/env.ts` utiliza dotenv y Zod para validar la configuración del servidor.

Las variables `DATABASE_URL` y `DIRECT_URL` son obligatorias.

`PORT` debe representar un número entero positivo y tiene como valor predeterminado `3010`.

Si la configuración es inválida, el servidor muestra un error y termina su ejecución mediante `process.exit(1)`.

No eliminar esta validación para permitir que el servidor arranque con una configuración incompleta.

### Validación de datos

Los esquemas de Zod se encuentran en:

`src/seguridad/validation.ts`

Para crear una sala:

- El nombre debe contener al menos 2 caracteres.
- El edificio debe contener al menos 1 carácter.
- La capacidad debe ser un número entero positivo.

Para crear una reserva:

- Responsable y motivo deben contener al menos 3 caracteres.
- Inicio y fin deben ser fechas válidas.
- La fecha de finalización debe ser posterior a la de inicio.
- La reserva debe comenzar en el futuro.

El identificador de sala debe ser un número entero positivo.

Los controladores de creación utilizan `safeParse` para validar los datos antes de procesarlos.

Si la información es inválida, se devuelve HTTP 400 con los detalles correspondientes.

Las validaciones del frontend mejoran la experiencia del usuario, pero el backend debe continuar siendo la autoridad definitiva.

### Precaución sobre PUT y DELETE

En la versión revisada, los controladores de actualización y eliminación no aplican exactamente las mismas validaciones que los controladores de creación.

`actualizarSala` utiliza directamente los datos recibidos en `req.body`.

Además, los controladores de actualización y eliminación no distinguen específicamente todos los casos en que una sala no existe y pueden responder HTTP 500 en lugar de HTTP 404.

No documentar estos endpoints como si tuvieran validación completa con Zod.

Si se modifica esta parte, implementar las validaciones y el manejo de errores apropiados sin afectar los demás endpoints.

---

## 8. Prevención de reservas traslapadas

El backend comprueba que no exista otra reserva de la misma sala que coincida con el horario solicitado.

La condición utilizada para detectar un traslape es:

```typescript
existing.inicio < nueva.fin &&
existing.fin > nueva.inicio
```

Por ejemplo:

- Una reserva de 08:00 a 10:00 y otra de 10:00 a 12:00 pueden coexistir.
- Una reserva de 09:00 a 11:00 entra en conflicto con otra de 10:00 a 12:00.

Si existe un conflicto, el backend responde con HTTP 409 Conflict.

### Control de concurrencia

La creación de reservas utiliza una transacción Prisma con aislamiento `Serializable`.

Esto permite gestionar situaciones en las que dos usuarios intentan reservar el mismo laboratorio en horarios coincidentes casi simultáneamente.

El controlador contempla reintentos ante conflictos de serialización identificados mediante el código `P2034` de Prisma.

No eliminar la transacción, los reintentos ni la comprobación de traslapes al modificar la lógica de reservas.

Si se cambia esta implementación, comprobar nuevamente su comportamiento ante solicitudes simultáneas.

---

## 9. Frontend React

El frontend se encuentra en:

`proyectolabs/frontend/`

Utiliza React y Vite.

La aplicación está organizada en componentes reutilizables dentro de `src/componentes/`.

### Componente principal

`src/App.jsx` organiza las secciones principales de la página.

Incluye la animación inicial, el encabezado, la presentación, la sección de disponibilidad y reservas, y el pie de página.

### Animación inicial

`componentes/animacion/AnimacionLogo.jsx`

Implementa la animación de presentación con la identidad institucional.

La aplicación utiliza `sessionStorage` para controlar su visualización durante la sesión de la pestaña.

También respeta la preferencia `prefers-reduced-motion`.

No eliminar estos comportamientos al modificar la animación.

### Encabezado y navegación

Los componentes principales se encuentran en:

- `componentes/encabezado/Encabezado.jsx`
- `componentes/encabezado/MenuNavegacion.jsx`

El encabezado contiene la identidad Landívar y la navegación hacia Inicio, Disponibilidad e Información.

Debe permanecer visible durante el desplazamiento de la página.

El encabezado se encuentra fuera del contenedor animado `.sitio` porque las transformaciones CSS de ese contenedor pueden interferir con `position: fixed`.

No trasladar el encabezado al interior del contenedor animado sin comprobar que conserve su posicionamiento fijo.

La navegación debe continuar funcionando en escritorio y dispositivos móviles.

### Presentación

`componentes/presentacion/FranjaPresentacion.jsx`

Contiene la presentación principal y la identidad visual del sistema.

### Disponibilidad

Los componentes principales se encuentran en:

- `componentes/disponibilidad/FranjaLaboratorios.jsx`
- `componentes/disponibilidad/TarjetaLaboratorio.jsx`
- `componentes/disponibilidad/ModalReserva.jsx`

La sección consulta los laboratorios desde el backend.

El carrusel permite navegar mediante flechas, puntos indicadores y desplazamiento horizontal.

El avance automático se pausa durante la interacción del usuario y cuando existe un modal de reserva abierto.

También respeta `prefers-reduced-motion`.

No sustituir los laboratorios obtenidos desde la API por información fija dentro de los componentes.

### Modal de reservas

`componentes/disponibilidad/ModalReserva.jsx`

El modal permite introducir responsable, motivo, fecha de inicio y fecha de finalización.

Antes de enviar la información, comprueba los campos y convierte las fechas a formato ISO.

Utiliza la función `crearReserva()` para enviar los datos al backend.

Si el backend responde HTTP 409, muestra un mensaje de horario ocupado y conserva los datos introducidos para que el usuario pueda modificar el horario y volver a intentarlo.

Después de una reserva exitosa, ejecuta la función de actualización de salas proporcionada por el componente de disponibilidad.

Esto permite actualizar la información sin recargar toda la página mediante `window.location.reload()`.

### Pie de página

`componentes/pie/PiePagina.jsx`

Contiene la identidad institucional, enlaces de navegación, redes sociales, información de contacto y copyright.

Los íconos utilizados por esta sección se encuentran en:

`componentes/pie/iconosPiePagina.jsx`

Conservar el diseño responsive y comprobar que los enlaces externos continúen funcionando después de cualquier modificación.

---

## 10. Comunicación entre frontend y backend

El archivo:

`frontend/src/servicios/salasApi.js`

Centraliza las solicitudes HTTP utilizadas por la interfaz.

Las funciones principales son:

- `obtenerSalas()`: consulta los laboratorios mediante GET.
- `crearReserva()`: envía una reserva mediante POST.

La versión revisada utiliza como dirección del backend:

`http://localhost:3010`

Esta dirección corresponde al entorno de desarrollo local.

Antes de desplegar el sistema en otro entorno, revisar la configuración de la URL de la API.

No distribuir una versión de producción que dependa de una dirección localhost.

El frontend debe manejar los estados de carga, éxito y error sin asumir que todas las solicitudes serán exitosas.

---

## 11. Pruebas de Postman versionadas

Las colecciones de Postman deben almacenarse en la carpeta `postman/` del repositorio.

La colección de Proyecto Labs se encuentra en:

`postman/ProyectoLabs.postman_collection.json`

Para exportar una colección:

1. Abrir la colección en Postman.
2. Seleccionar More actions > Export.
3. Elegir Collection v2.1.
4. Exportar el archivo JSON dentro de `postman/`.
5. Revisar el JSON antes del commit y reemplazar secretos por variables.
6. No exportar valores sensibles de ambientes de Postman.

La colección desarrollada para Proyecto Labs incluye casos válidos e inválidos de las operaciones sobre salas y reservas.

Antes de modificar los endpoints, revisar las pruebas existentes y comprobar si deben actualizarse.

No afirmar que todas las pruebas pasan sin ejecutarlas.

No ejecutar pruebas que creen, modifiquen o eliminen información en la base de datos compartida sin considerar sus consecuencias.

---

## 12. Decisiones técnicas que deben conservarse

Al continuar el desarrollo de Proyecto Labs, respetar las siguientes decisiones:

- Mantener separados el backend y el frontend.
- Utilizar Prisma Client para las operaciones sobre PostgreSQL.
- Conservar la relación entre Sala y Reserva.
- Considerar el efecto de `onDelete: Cascade` antes de eliminar salas.
- Mantener las validaciones de Zod en el servidor.
- Conservar la prevención de reservas traslapadas y el control de concurrencia.
- No reemplazar los laboratorios dinámicos por datos fijos.
- Mantener la actualización de disponibilidad después de crear una reserva.
- Conservar el comportamiento del modal ante errores HTTP 409.
- Mantener el encabezado fuera del contenedor animado que interfiere con su posicionamiento fijo.
- Respetar la navegación responsive y las preferencias de reducción de movimiento.
- No modificar funcionalidades ajenas al objetivo solicitado.

---

## 13. Precauciones y tareas pendientes

Los siguientes puntos deben revisarse antes de realizar modificaciones relacionadas:

### Validaciones de actualización

El controlador de actualización de salas no utiliza las mismas validaciones Zod que la creación.

Si se amplía esta funcionalidad, validar los datos recibidos antes de enviarlos a Prisma.

### Manejo de errores HTTP

Los controladores PUT y DELETE pueden responder HTTP 500 cuando se intenta operar sobre una sala inexistente.

Revisar el manejo de errores para distinguir los casos que corresponden a HTTP 404 de los errores internos del servidor.

### Script seed

El archivo `prisma/seed.ts` no aparece entre los archivos versionados revisados.

No asumir que el comando `npm run seed` está implementado.

### Despliegue

La dirección local del backend utilizada por el frontend debe revisarse antes de desplegar el sistema fuera del entorno de desarrollo.

### Estado de las pruebas

Las verificaciones descritas por los integrantes del equipo corresponden a sus respectivas fases de desarrollo.

Después de cualquier modificación, ejecutar nuevamente las pruebas pertinentes y registrar sus resultados reales.

---

## 14. Entrega con Git

Proyecto Labs utiliza ramas individuales para desarrollar las distintas funcionalidades.

El flujo de integración utilizado por el equipo es mediante Pull Requests hacia `dev`.

Antes de comenzar:

- [ ] Ejecutar `git fetch origin`.
- [ ] Actualizar la rama `dev` desde el repositorio remoto.
- [ ] Crear una rama dedicada a partir de la versión actualizada.
- [ ] Revisar el objetivo y los archivos que corresponden a la tarea.
- [ ] Consultar este documento y el código relacionado.

Antes de realizar un commit:

- [ ] Revisar `git diff` y `git status`.
- [ ] Confirmar que no se incluyan archivos `.env` ni credenciales.
- [ ] Confirmar que no se incluyan dependencias instaladas en `node_modules/`.
- [ ] Comprobar que `.env.example` no contenga secretos.
- [ ] Revisar que no existan cambios accidentales en archivos ajenos a la tarea.
- [ ] Ejecutar las pruebas pertinentes y registrar sus resultados reales.
- [ ] Crear un commit descriptivo.

Para entregar:

- [ ] Publicar la rama en GitHub.
- [ ] Crear un Pull Request hacia `dev`.
- [ ] Revisar posibles conflictos antes de integrar los cambios.
- [ ] Comunicar al equipo qué se modificó y qué pruebas se realizaron.

No realizar cambios directamente en `main` ni integrar ramas sin respetar el flujo acordado por el equipo.

---

## 15. Límites para cualquier IA

- No inventar resultados de pruebas ni afirmar que algo fue verificado si no se ejecutó.
- No agregar dependencias sin autorización.
- No reducir controles de seguridad para resolver errores.
- No modificar archivos ajenos al objetivo solicitado.
- No introducir contraseñas ni credenciales en el código o la documentación.
- No ejecutar operaciones destructivas sobre la base de datos compartida sin autorización.
- No eliminar funcionalidades existentes para simplificar una modificación.
- No reemplazar componentes reutilizables por implementaciones duplicadas sin una justificación técnica.
- No asumir que la documentación está actualizada sin comprobar el código correspondiente.
- Explicar cualquier riesgo, supuesto, limitación o tarea pendiente de forma visible.
- Registrar las decisiones técnicas importantes para que puedan aprovecharse en futuras fases del proyecto.

El objetivo del Compound es conservar el conocimiento acumulado, facilitar la continuidad del desarrollo y evitar que futuras modificaciones repitan errores o deshagan decisiones técnicas anteriores.