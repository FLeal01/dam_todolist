<img width="2455" height="701" alt="Image" src="https://github.com/user-attachments/assets/0a2e96c1-9acf-45d2-8c58-4bfa0c193556" />  


# To Do List
Autora: Fabiola Leal, estudiante de Ingeniería en Informática.  
**Versión actual: 2.0**

---

Aplicación móvil de gestión de tareas pendientes desarrollada con **React Native**, **Expo** y **TypeScript**. Permite registrar, visualizar, editar y eliminar tareas, cada una con un título y una descripción.

La **versión 2.0** incorpora cuentas de usuario con contraseñas cifradas, tareas aisladas por usuario, uso de los periféricos del dispositivo (**cámara** y **GPS**) con gestión de permisos, fechas de vencimiento con temporizador en vivo, estado completado, integración con un servicio web externo (importación y sincronización) y una suite de pruebas automatizadas con Jest. La interfaz adopta un tema oscuro de alto contraste, inspirado en consolas de desarrollo.

Proyecto desarrollado para la **Evaluación Sumativa Unidad N.º 1** (versión 1.0) y la **Evaluación de la Unidad N.º 2** (versión 2.0) de la asignatura *Desarrollo de Aplicaciones Móviles* (Instituto Profesional San Sebastián). Es la base sobre la que se construirán las funcionalidades de las siguientes unidades: almacenamiento local persistente y un servicio web propio.

---

## Tabla de contenidos

1. [Características](#características)
2. [Stack tecnológico](#stack-tecnológico)
3. [Requisitos previos](#requisitos-previos)
4. [Instalación y ejecución](#instalación-y-ejecución)
5. [Scripts disponibles](#scripts-disponibles)
6. [Estructura del proyecto](#estructura-del-proyecto)
7. [Arquitectura y patrones de diseño](#arquitectura-y-patrones-de-diseño)
8. [Componentes principales](#componentes-principales)
9. [Modelo de datos](#modelo-de-datos)
10. [Funcionalidades de la versión 2.0](#funcionalidades-de-la-versión-20)
11. [Seguridad y privacidad](#seguridad-y-privacidad)
12. [Pruebas automatizadas](#pruebas-automatizadas)
13. [Diseño de la interfaz](#diseño-de-la-interfaz)
14. [Manejo de errores y validaciones](#manejo-de-errores-y-validaciones)
15. [Correspondencia con la rúbrica de la Unidad 2](#correspondencia-con-la-rúbrica-de-la-unidad-2)
16. [Nota sobre el framework](#nota-sobre-el-framework)
17. [Solución de problemas](#solución-de-problemas)
18. [Evolución del proyecto](#evolución-del-proyecto)
19. [Evidencias (Imágenes V1.0 y V2.0)](#evidencias)
20. [Licencia](#licencia)

---

## Características

- **Lista de tareas** con una tarjeta por tarea que muestra título y descripción.
- **Agregar tareas** mediante un formulario con campos de título y descripción. Los campos se limpian después de guardar.
- **Editar tareas** reutilizando el mismo formulario en modo edición.
- **Eliminar tareas** con un botón junto a cada una y confirmación previa.
- **Validación**: el título es obligatorio; la descripción es opcional.
- **Estados de interfaz**: indicador de carga, mensaje de lista vacía y mensajes de error visibles para el usuario.
- **Arquitectura preparada para crecer**: el acceso a datos está aislado detrás de una interfaz, de modo que cambiar la fuente de datos no obliga a modificar las pantallas.

### Novedades de la versión 2.0

- **Registro e inicio de sesión** con validación de formato de correo y de la complejidad de la contraseña (checklist en tiempo real).
- **Contraseñas cifradas con BCrypt** (`bcryptjs`), con aleatoriedad criptográfica del sistema (`expo-crypto`). La contraseña nunca se guarda ni se expone en texto plano.
- **Tareas aisladas por usuario**: cada cuenta ve únicamente sus propias tareas, aunque compartan el mismo dispositivo.
- **Cámara**: adjuntar una fotografía a la tarea, con vista previa, opción de cambiarla o quitarla y miniatura en la lista.
- **GPS**: registrar las coordenadas (latitud y longitud) de la tarea.
- **Gestión de permisos** de cámara y ubicación: se solicitan al momento de usarlos y la aplicación sigue funcionando si se deniegan.
- **Fecha límite opcional con temporizador en vivo**: atajos rápidos, fecha y hora exactas con validación de calendario real, y cuenta regresiva con estados visuales (normal, urgente, expirada, completada).
- **Estado completado**: marcar y reabrir tareas; las completadas pasan al final de la lista.
- **Orden inteligente**: las pendientes con vencimiento más próximo aparecen primero.
- **Integración con una API externa**: importar tareas y sincronizar las del usuario, con indicador de sincronización por tarea.
- **Resumen de la lista** ("N pendientes · M listas") y cierre de sesión con confirmación.
- **Tema oscuro** de alto contraste con tipografía monoespaciada.
- **Suite de pruebas unitarias con Jest** (5 archivos, 11 pruebas).

---

## Stack tecnológico

| Área | Tecnología |
|---|---|
| Framework móvil | React Native 0.88 con Expo SDK 58 |
| Biblioteca de UI base | React 19 (componentes funcionales y hooks) |
| Lenguaje | TypeScript (modo `strict`) |
| Componentes de interfaz | React Native Elements (`@rneui/themed`) y componentes nativos de React Native |
| Navegación | React Navigation (`native-stack`) |
| Seguridad de contraseñas | `bcryptjs` (hash BCrypt) y `expo-crypto` (generador aleatorio criptográfico) |
| Cámara | `expo-image-picker` |
| Geolocalización (GPS) | `expo-location` |
| Servicios web | `fetch` nativo contra una API REST externa (JSONPlaceholder) |
| Pruebas | Jest 30 con el preset `jest-expo` |
| Entorno de desarrollo | Node.js 22 (LTS), npm, Docker y Docker Compose (opcional) |
| Soporte web | `react-native-web` (alternativa para probar en el navegador) |

---

## Requisitos previos

**Opción A, sin Docker**

- Node.js 22 (LTS) y npm.
- La aplicación **Expo Go** instalada en el teléfono (Android o iOS), o un emulador, o un navegador para la versión web.

**Opción B, con Docker**

- Docker y Docker Compose.
- La aplicación **Expo Go** en el teléfono, conectado a la misma red Wi-Fi que el equipo.

> Para probar la **cámara** y el **GPS** se recomienda un teléfono físico con Expo Go. Los emuladores ofrecen cámara y ubicación simuladas, y en la versión web el comportamiento de ambos periféricos depende del navegador.

---

## Instalación y ejecución

### Sin Docker

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor de desarrollo de Expo
npm start
```

Al iniciar, Expo muestra un código QR en la terminal:

- **Teléfono:** escanéalo con Expo Go (Android) o con la cámara (iOS).
- **Navegador:** ejecuta `npm run web` para abrir la versión web.
- **Emulador:** presiona `a` (Android) o `i` (iOS) en la terminal.

### Con Docker

1. Copia el archivo de variables de entorno y define la IP local de tu equipo:

   ```bash
   cp .env.example .env
   ```

   Edita `.env` y reemplaza el valor de `HOST_IP`. Para conocer tu IP:

   | Sistema | Comando |
   |---|---|
   | Windows | `ipconfig` |
   | macOS | `ipconfig getifaddr en0` |
   | Linux | `hostname -I` |

2. Levanta el entorno:

   ```bash
   docker compose up --build
   ```

3. Escanea el código QR con Expo Go. El bundler queda expuesto en el puerto `8081` y el código se recarga automáticamente al editarlo.

4. Para comprobar los tipos dentro del contenedor:

   ```bash
   docker compose run --rm app npx tsc --noEmit
   ```

Si cambias las dependencias, reconstruye el entorno con `docker compose down -v && docker compose up --build`.

> El archivo `.npmrc` activa `legacy-peer-deps` porque una dependencia de pruebas de `@rneui/base` declara un rango de `react-test-renderer` más estricto que la versión de React incluida en Expo. No afecta el funcionamiento de la aplicación.

### Primer acceso

La aplicación inicia en la pantalla de **inicio de sesión**. Hay dos formas de entrar:

| Opción | Datos |
|---|---|
| Cuenta de demostración | Correo `demo@correo.cl` · Contraseña `123456` |
| Cuenta nueva | Pulsa **Regístrate aquí** y completa el formulario. La contraseña debe cumplir los requisitos de seguridad indicados en pantalla |

> La cuenta de demostración existe solo para probar la aplicación. Los usuarios y las tareas se guardan **en memoria**: al cerrar la aplicación se pierden las cuentas creadas y las tareas; la cuenta de demostración se restablece en cada inicio.

### Flujo de uso recomendado

1. Inicia sesión (o regístrate).
2. Pulsa **Nueva tarea** y completa título y descripción.
3. Opcionalmente activa la **fecha límite**, adjunta una **foto** y registra el **GPS**.
4. Guarda: la tarea aparece en la lista, con su temporizador, miniatura y coordenadas.
5. Marca tareas como **Listo**, edítalas o elimínalas.
6. Usa **Importar API** para traer tareas externas y **Sincronizar** para enviar las tuyas.
7. Cierra sesión con **Salir**.

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor de desarrollo de Expo |
| `npm run android` | Inicia Expo y abre la app en Android |
| `npm run ios` | Inicia Expo y abre la app en iOS |
| `npm run web` | Inicia Expo y abre la versión web |
| `npm run typecheck` | Comprueba los tipos de TypeScript sin generar archivos |
| `npm test` | Ejecuta la suite de pruebas unitarias con Jest |

---

## Estructura del proyecto

```
to-do-list/
├── __tests__/                         Suites de pruebas unitarias con Jest
│   ├── dateTime.test.ts               Validación de fechas y formato del temporizador
│   ├── devicePeripherals.test.ts      Servicios de periféricos (cámara, ubicación y permisos)
│   ├── externalTaskApi.test.ts        Importación y sincronización con la API (fetch simulado)
│   ├── memoryTaskRepository.test.ts   CRUD y estado de sincronización del repositorio en memoria
│   └── passwordHash.test.ts           Cifrado y verificación con BCrypt
├── App.tsx                            Punto de entrada: proveedores de Auth y Tasks, tema y navegación
├── index.ts                           Registro del componente raíz en Expo
├── app.json                           Configuración de la aplicación Expo
├── package.json                       Dependencias, scripts y preset de Jest
├── tsconfig.json                      Configuración de TypeScript (strict)
├── Dockerfile                         Imagen de desarrollo
├── docker-compose.yml                 Servicio, puertos y volúmenes
├── .env.example                       Plantilla de variables de entorno (HOST_IP)
├── .npmrc                             Configuración de npm (legacy-peer-deps)
├── .dockerignore                      Archivos excluidos de la imagen de Docker
├── LICENSE                            Licencia del repositorio
├── plan.md                            Plan de trabajo de la versión 1.0
├── assets/                            Íconos y recursos gráficos
└── src/
    ├── components/
    │   ├── TaskItem.tsx               Tarjeta de tarea (estado, foto, GPS, temporizador, sincronización, acciones)
    │   ├── EmptyState.tsx             Mensaje cuando el usuario no tiene tareas
    │   └── PasswordInput.tsx          Campo de contraseña con botón mostrar/ocultar
    ├── context/
    │   ├── AuthContext.tsx            Sesión, registro, inicio y cierre de sesión
    │   └── TasksContext.tsx           Tareas del usuario, CRUD, importación y sincronización
    ├── hooks/
    │   └── useCountdown.ts            Cuenta regresiva en vivo con refresco adaptativo
    ├── screens/
    │   ├── LoginScreen.tsx            Inicio de sesión
    │   ├── RegisterScreen.tsx         Registro de cuentas con checklist de contraseña
    │   ├── TaskListScreen.tsx         Lista, importación, sincronización y cierre de sesión
    │   └── TaskFormScreen.tsx         Formulario de creación y edición (cámara, GPS, vencimiento)
    ├── services/
    │   ├── taskRepository.ts          Interfaz (contrato) de acceso a datos
    │   ├── memoryTaskRepository.ts    Implementación en memoria
    │   ├── devicePeripherals.ts       Acceso a cámara, GPS y permisos del dispositivo
    │   └── externalTaskApi.ts         Cliente REST para importar y sincronizar tareas
    ├── theme/
    │   └── theme.ts                   Paleta oscura, espaciado, radios y tipografía monoespaciada
    ├── types/
    │   ├── auth.ts                    Tipos User, AuthUser, NewUser y LoginCredentials
    │   ├── task.ts                    Tipos Task, TaskLocation, NewTask y UpdateTask
    │   └── navigation.ts              Tipos de las rutas públicas y protegidas
    └── utils/
        ├── confirm.ts                 Diálogo de confirmación multiplataforma
        ├── createId.ts                Generador de identificadores únicos
        ├── dateTime.ts                Validación de fechas, formato y cálculo de tiempo restante
        ├── passwordHash.ts            Hash y verificación de contraseñas (BCrypt + expo-crypto)
        └── validation.ts              Validación de correo y reglas de complejidad de contraseña
```

---

## Arquitectura y patrones de diseño

La aplicación separa responsabilidades en capas, de modo que cada archivo tiene un propósito claro.

| Capa | Ubicación | Responsabilidad |
|---|---|---|
| Presentación | `screens/`, `components/`, `hooks/` | Mostrar datos y capturar la interacción del usuario |
| Estado | `context/` | Mantener la sesión y la lista de tareas, y exponer las operaciones |
| Acceso a datos | `services/` | Leer y escribir tareas detrás de una interfaz; comunicarse con la API externa |
| Soporte | `types/`, `theme/`, `utils/` | Tipos, estilos, validaciones y utilidades compartidas |

### Patrones aplicados

- **Componentes funcionales y hooks.** Toda la interfaz se construye con funciones y los hooks `useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`, `useLayoutEffect` y `useContext`.
- **Context API con Provider (`AuthContext` y `TasksContext`).** La sesión y las tareas viven en proveedores y se consumen con los hooks `useAuth()` y `useTasks()`, evitando pasar datos por múltiples niveles (prop drilling). Ambos hooks lanzan un error si se usan fuera de su proveedor.
- **Proveedores anidados con dependencia explícita.** `TasksProvider` se monta dentro de `AuthProvider` y usa `useAuth()` para conocer al usuario activo y filtrar sus tareas.
- **Navegación condicional por sesión.** El navegador muestra las rutas públicas (`Login`, `Register`) o las protegidas (`TaskList`, `TaskForm`) según exista un usuario autenticado, de modo que no se puede acceder a las tareas sin iniciar sesión.
- **Patrón Repository (`TaskRepository`).** Una interfaz define las operaciones `getAll`, `create`, `update` y `remove`. Hoy se implementa en memoria; las próximas unidades añadirán implementaciones locales o con API sin reescribir las pantallas. El proveedor recibe el repositorio por props, lo que permite sustituirlo (inyección de dependencias).
- **Capa de servicio para la API externa (`externalTaskApi`).** Aísla las llamadas HTTP y transforma el formato del servicio externo (DTO) al modelo interno de la aplicación, de modo que el resto del código no depende de la estructura de la API.
- **Hook personalizado (`useCountdown`).** Encapsula la lógica del temporizador y su ciclo de vida (creación y limpieza del intervalo) para reutilizarla en cada tarjeta de tarea.
- **Estado derivado con `useMemo`.** La lista visible (tareas del usuario, ordenadas por estado y vencimiento) se calcula a partir del estado base en lugar de almacenarse por separado.
- **Minimización de datos sensibles.** El tipo `AuthUser` (`Omit<User, 'password'>`) garantiza que las pantallas nunca reciban el hash de la contraseña.
- **Separación entre pantallas y componentes de presentación.** Las pantallas (`screens/`) coordinan estado y navegación; los componentes (`components/`) reciben datos y callbacks por props y no conocen el origen de la información.
- **Componentes controlados.** Los campos `TextInput` están ligados al estado de React mediante `value` y `onChangeText`.
- **Comunicación hijo a padre mediante props.** `TaskItem` notifica las acciones del usuario con los callbacks `onToggleComplete`, `onEdit` y `onDelete`.
- **Reutilización de pantalla.** `TaskFormScreen` sirve para crear y para editar: el modo se determina según si recibe una tarea como parámetro de navegación.
- **Navegación en pila tipada.** React Navigation (`native-stack`) con un `RootStackParamList` que tipa las rutas y sus parámetros.
- **Virtualización de listas.** `FlatList` renderiza solo los elementos visibles, lo que mantiene el rendimiento con listas largas.
- **Sistema de diseño centralizado.** Colores, espaciado, radios y tipografía se definen una sola vez en `theme/theme.ts`.

---

## Componentes principales

| Componente | Origen | Uso en la aplicación |
|---|---|---|
| `NavigationContainer` y `Stack.Navigator` | React Navigation | Navegación entre pantallas públicas y protegidas; el encabezado de cada pantalla |
| `FlatList` | React Native | Lista de tareas con renderizado eficiente |
| `ListItem` | `@rneui/themed` | Tarjeta de cada tarea |
| `TextInput` | React Native | Campos de título, descripción, credenciales y fecha/hora |
| `Button` | `@rneui/themed` | Guardar, actualizar, importar, sincronizar y las acciones Listo, Editar y Eliminar |
| `Switch` | React Native | Activar o desactivar la fecha límite en el formulario |
| `Pressable` | React Native | Casilla de completado, atajos de fecha y botón mostrar/ocultar contraseña |
| `Image` | React Native | Vista previa de la foto en el formulario y miniatura en la lista |
| `KeyboardAvoidingView` y `ScrollView` | React Native | Formularios que no quedan tapados por el teclado |
| `ActivityIndicator` | React Native | Indicador de carga |
| `SafeAreaProvider` y `SafeAreaView` | `react-native-safe-area-context` | Respeta las áreas seguras del dispositivo |
| `PasswordInput` | Propio | Campo de contraseña con visibilidad conmutable |
| `TaskItem` | Propio | Tarjeta con estado, foto, GPS, temporizador y sincronización |
| `EmptyState` | Propio | Mensaje de lista vacía |

---

## Modelo de datos

**Versión 2.0**

```ts
type TaskLocation = {
  latitude: number;
  longitude: number;
};

type Task = {
  id: string;            // identificador único
  userId: string;        // propietario de la tarea (aislamiento por usuario)
  title: string;         // obligatorio
  description: string;   // opcional
  completed: boolean;    // estado de la tarea
  createdAt: string;     // fecha de creación (ISO 8601)
  dueAt?: string;        // fecha límite (ISO 8601), opcional
  syncedAt?: string;     // última sincronización con la API (ISO 8601)
  imageUri?: string;     // fotografía adjunta
  location?: TaskLocation; // coordenadas GPS
};

type NewTask = Omit<Task, 'id' | 'createdAt'> & { createdAt?: string };
type UpdateTask = Partial<Omit<Task, 'id' | 'userId'>>;
```

```ts
type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;      // almacena el HASH BCrypt, nunca la contraseña en texto plano
};

type AuthUser = Omit<User, 'password'>;   // lo único que ven las pantallas
type NewUser = Omit<User, 'id'>;
type LoginCredentials = { email: string; password: string };
```

Contrato de acceso a datos:

```ts
interface TaskRepository {
  getAll(): Promise<Task[]>;
  create(data: NewTask): Promise<Task>;
  update(id: string, data: UpdateTask): Promise<Task>;
  remove(id: string): Promise<void>;
}
```

Las tareas y los usuarios se almacenan **en memoria**: se pierden al cerrar la aplicación. La persistencia se incorporará en la unidad de almacenamiento local.

<details>
<summary><strong>Versión 1.0 del modelo (histórico)</strong></summary>

```ts
type Task = {
  id: string;          // identificador único
  title: string;       // obligatorio
  description: string; // opcional
};

type NewTask = Omit<Task, 'id'>;
type TaskUpdate = Partial<NewTask>;
```

</details>

---

## Funcionalidades de la versión 2.0

### Autenticación de usuarios

- **Registro** (`RegisterScreen`): nombre y apellido (mínimo 2 caracteres), correo con formato válido, contraseña que cumple las reglas de complejidad y confirmación de contraseña. Si el correo ya está registrado, se informa.
- **Inicio de sesión** (`LoginScreen`): valida campos vacíos y formato de correo. Ante credenciales incorrectas muestra siempre el mismo mensaje ("Correo o contraseña incorrectos."), sin revelar si el correo existe.
- **Sesión** (`AuthContext`): expone `currentUser`, `login`, `register` y `logout`. Al cerrar sesión se vuelve a las pantallas públicas y las tareas del usuario dejan de mostrarse.
- **Contraseña**: campo con botón para mostrar u ocultar; en el registro, una lista de requisitos se actualiza en tiempo real:

| Requisito | Regla |
|---|---|
| Longitud | Mínimo 8 caracteres |
| Mayúscula | Al menos una letra de la A a la Z |
| Minúscula | Al menos una letra de la a a la z |
| Número | Al menos un dígito |
| Símbolo | Al menos un carácter no alfanumérico |

### Tareas por usuario

Cada tarea guarda el `userId` de su propietario. `TasksContext` filtra la lista según el usuario autenticado, por lo que dos cuentas en el mismo dispositivo no ven las tareas de la otra. La lista se ordena así:

1. Las **completadas** van al final.
2. Entre las pendientes, las que tienen **fecha límite** van primero, de la más próxima a la más lejana.
3. Las pendientes **sin fecha límite** se ordenan de la más reciente a la más antigua.

### Cámara

- El botón **Tomar foto** (o **Cambiar foto**) solicita el permiso de cámara y abre la cámara con `expo-image-picker` (`launchCameraAsync`).
- La captura se comprime (`quality: 0.7`) y permite recortar o editar antes de aceptar.
- El formulario muestra una **vista previa** con la opción **Quitar foto**; la lista muestra una **miniatura** en la tarjeta de la tarea.
- Cancelar la cámara no modifica la tarea.

### GPS

- El botón **Obtener GPS** (o **Actualizar GPS**) solicita el permiso de ubicación en primer plano y lee la posición actual con precisión equilibrada (`Location.Accuracy.Balanced`), que ahorra batería frente a la máxima precisión.
- Mientras se obtiene la posición, el botón muestra un indicador de carga y se deshabilita para evitar lecturas simultáneas.
- Las coordenadas se muestran en el formulario con 5 decimales y en la tarjeta de la tarea con 4 decimales.

### Permisos

| Recurso | Cuándo se solicita | Si se deniega |
|---|---|---|
| Cámara | Al pulsar **Tomar foto** o **Cambiar foto** (nunca al abrir la aplicación) | Mensaje "Se necesita permiso de cámara para adjuntar una foto." La tarea se puede guardar sin foto |
| Ubicación | Al pulsar **Obtener GPS** o **Actualizar GPS** (nunca al abrir la aplicación) | Mensaje "Se necesita permiso de ubicación para registrar el GPS." La tarea se puede guardar sin coordenadas |

Solo se solicitan los permisos necesarios: cámara y ubicación **en primer plano**. La aplicación no utiliza ubicación en segundo plano ni micrófono. Si ocurre un error al abrir la cámara o al leer el GPS, se muestra un mensaje y la aplicación continúa funcionando.

### Fecha límite y temporizador

- Un interruptor activa la fecha límite; al activarlo se propone por defecto **+2 horas**.
- **Atajos rápidos:** +1 hora, +3 horas, Hoy 23:59, Mañana y +3 días.
- **Fecha y hora exactas** en campos `DD / MM / AAAA` y `HH : MM`, con avance automático entre campos y entrada limitada a dígitos.
- **Validación de calendario real** (`parseCustomDateTime`): rechaza meses y días fuera de rango, horas y minutos inválidos y fechas inexistentes (por ejemplo, 31 de febrero), que JavaScript desbordaría silenciosamente.
- **Vista previa en vivo:** "Vence el miércoles 25 nov a las 18:30 (en 3 días y 2 horas)".
- Al **crear** una tarea, la fecha límite debe ser posterior a la hora actual; al **editar**, se permite conservar una fecha ya vencida.

Cada tarjeta muestra un temporizador (`useCountdown`) con estos estados:

| Estado | Condición | Texto | Refresco |
|---|---|---|---|
| Sin temporizador | La tarea no tiene fecha límite | — | — |
| Normal | Faltan 24 horas o más | `Quedan 3d 05h 12m` | Cada minuto |
| Urgente | Faltan menos de 24 horas | `Quedan 05h 12m 30s` (insignia ámbar) | Cada segundo |
| Expirada | La fecha límite ya pasó | `EXPIRADA` (insignia roja) | Sin intervalo activo |
| Completada | La tarea con fecha límite está completada | `Completada a tiempo ✓` | Sin intervalo activo |

El refresco adaptativo (cada minuto mientras falta más de un día y cada segundo solo en la última jornada) reduce el consumo de batería, y el intervalo se limpia al desmontar la tarjeta o al cambiar el estado.

### Estado completado

La casilla de la tarjeta y el botón **Listo** / **Reabrir** alternan el estado de la tarea. La casilla incluye rol y estado de accesibilidad (`checkbox`), y las tareas completadas se muestran atenuadas y con el título tachado.

### Integración con servicios web

Los botones **Importar API** y **Sincronizar** de la pantalla principal usan el servicio [JSONPlaceholder](https://jsonplaceholder.typicode.com), una API REST pública de pruebas, a través de HTTPS.

| Operación | Método y endpoint | Comportamiento |
|---|---|---|
| Importar | `GET /todos?_limit=5` | Descarga 5 tareas y las convierte al modelo interno: el título se recorta a 80 caracteres, la descripción indica el ID de origen y se conserva el estado `completed`. Las tareas importadas se asocian al usuario activo y quedan marcadas como sincronizadas |
| Sincronizar | `POST /posts` | Envía las tareas del usuario con la fecha de sincronización. Si la respuesta es correcta, actualiza `syncedAt` en todas ellas |

- Mientras hay una operación en curso, los botones de la pantalla principal se deshabilitan y muestran un indicador de carga (estado `syncing`).
- Cada tarjeta indica su estado: **✓ Sync (fecha)** o **☁ No sincronizada**. Editar una tarea la vuelve a marcar como no sincronizada.
- Los errores HTTP (`response.ok` falso) y de red se capturan y se muestran como mensajes visibles; los datos locales se conservan intactos.
- La pantalla informa el resultado: "Se importaron N tareas desde la API externa." o "Sincronización completa: N tareas enviadas a la nube."

> JSONPlaceholder acepta peticiones `POST`, pero no guarda los datos: simula la respuesta. La sincronización de esta versión demuestra el flujo completo de comunicación con un servicio web; en una versión de producción se reemplazará por un servicio propio con autenticación.

---

## Seguridad y privacidad

**Medidas implementadas**

| Ámbito | Medida |
|---|---|
| Contraseñas | Hash BCrypt con sal única por usuario (`bcryptjs`, factor de costo 8). La aleatoriedad de la sal proviene del generador criptográfico del sistema (`expo-crypto`) |
| Exposición de datos | La contraseña no se almacena en texto plano y las pantallas solo reciben `AuthUser`, sin el hash |
| Política de contraseña | Cinco reglas de complejidad verificadas en el registro, con retroalimentación en tiempo real |
| Inicio de sesión | Mensaje único para correo inexistente o contraseña incorrecta, sin revelar qué dato falló |
| Control de acceso | Las rutas con tareas solo existen para una sesión activa |
| Aislamiento | Cada usuario ve únicamente las tareas con su `userId` |
| Permisos | Mínimo privilegio: cámara y ubicación en primer plano, solicitadas solo al usarlas |
| Comunicación | Todas las llamadas a servicios externos usan HTTPS |
| Entrada de datos | Validación de formato de correo, complejidad de contraseña, longitud del título (80 caracteres) y calendario real de las fechas |
| Secretos | El archivo `.env` está excluido del control de versiones (`.gitignore`) |

Las limitaciones de seguridad conocidas de esta versión se detallan en [Limitaciones conocidas y trabajo futuro](#limitaciones-conocidas-y-trabajo-futuro).

---

## Pruebas automatizadas

Las pruebas unitarias se ejecutan con **Jest** (preset `jest-expo`):

```bash
npm test
```

| Archivo | Pruebas | Qué verifica |
|---|---|---|
| `dateTime.test.ts` | 3 | Una fecha válida se convierte a ISO; una fecha inexistente (31 de febrero) se rechaza; el tiempo restante se formatea en horas y minutos |
| `devicePeripherals.test.ts` | 4 | Servicios de periféricos del dispositivo (cámara, ubicación y permisos) |
| `externalTaskApi.test.ts` | 2 | La importación transforma la respuesta de la API al modelo local; la sincronización envía las tareas y devuelve el conteo (con `fetch` simulado mediante `jest.fn`) |
| `memoryTaskRepository.test.ts` | 1 | Flujo de crear, actualizar estado y sincronización, y eliminar tareas |
| `passwordHash.test.ts` | 1 | El hash difiere de la contraseña, tiene formato BCrypt, valida la contraseña correcta y rechaza una incorrecta |

**Resultado de la última ejecución:** 5 suites y 11 pruebas aprobadas. La comprobación de tipos (`npm run typecheck`) finaliza sin errores.



---

## Diseño de la interfaz

### Versión 2.0 — Modo oscuro 

La interfaz adopta una estética inspirada en consolas y terminales de desarrollo, de alto contraste, con tipografía monoespaciada del sistema (Menlo en iOS, `monospace` en Android y Fira Code, Cascadia Code o Consolas en la web).

**Paleta**

| Rol | Color | Uso |
|---|---|---|
| Fondo principal | `#080C0A` (negro terminal) | Fondo de pantallas y encabezados |
| Superficie | `#0F1713` | Tarjetas, campos de formulario y cuadros de información |
| Acento primario | `#00FF66` (verde fósforo) | Botones principales, foco de los campos, estados activos y sincronización correcta |
| Texto sobre acento | `#04140A` | Texto de los botones principales |
| Texto | `#D8FBE5` | Títulos y contenido principal |
| Texto atenuado | `#6FA384` | Descripciones y metadatos secundarios |
| Texto de ayuda | `#3E634D` | Marcadores de posición (*placeholders*) |
| Bordes | `#1B3325` y `#00CC52` | Contornos finos y borde resaltado |
| Alerta / vencimiento | `#FF3B5C` sobre `#2B0D14` | Tareas expiradas, errores, validaciones y acciones destructivas |
| Advertencia | `#FFB020` sobre `#261A04` | Tareas no sincronizadas y temporizador urgente (menos de 24 horas) |

**Criterios aplicados**

- **Tipografía:** fuente monoespaciada en toda la interfaz, sin cargar fuentes externas.
- **Estilo terminal:** radios de borde pequeños (4, 6 y 8) para un aspecto más recto, bordes finos tipo cuadrícula y acentos de color con significado: verde para estado correcto, ámbar para advertencia y rojo para riesgo.
- **Jerarquía visual:** el título destaca por tipo y peso; la descripción y los metadatos usan tonos atenuados; las tareas completadas se atenúan y se tachan.
- **Retroalimentación:** el campo activo resalta su borde, el título muestra un contador de caracteres, los atajos de fecha y la vista previa del vencimiento responden en vivo y los botones deshabilitados o en carga cambian de tono.
- **Estado vacío:** ícono minimalista y mensaje que indica cómo agregar la primera tarea.
- **Accesibilidad:** etiquetas de accesibilidad en campos, casillas y botones de mostrar contraseña; roles `alert` y `status` en los mensajes de la lista. El contraste del texto principal sobre el fondo es de 17,7:1 y el del texto atenuado de 6,8:1 (WCAG AA exige 4,5:1 para texto normal).

### Versión 1.0 — Paleta clara neutra (histórico)

<details>
<summary><strong>Ver el diseño de la versión 1.0</strong></summary>

El diseño buscaba una estética sobria, elegante y serena, basada en colores neutros.

**Paleta**

| Rol | Color | Uso |
|---|---|---|
| Fondo | `#EFEEEC` (gris piedra) | Fondo de pantallas y encabezado |
| Superficie | `#FAFAF9` | Tarjetas y campos de texto |
| Texto | `#1F1F1E` | Títulos y texto principal |
| Texto atenuado | `#6E6D6A` | Descripciones y datos secundarios |
| Acento | `#2C2C2A` (carbón) | Botones principales y foco de los campos |
| Bordes | `#DDDCD8` | Separadores y contornos finos |
| Alerta | `#8E3B36` (rojo apagado) | Solo acciones destructivas y errores |

**Criterios aplicados**

- **Tipografía:** títulos con la tipografía serif del sistema (Georgia en iOS y web, serif en Android) y texto de apoyo en sans-serif, sin cargar fuentes externas.
- **Jerarquía visual:** el título de cada tarea destaca por tipo y peso; la descripción usa un tono atenuado; las acciones secundarias quedan separadas por un filete fino.
- **Tarjetas:** borde fino y sombra casi imperceptible, con radios de borde uniformes.
- **Ritmo y espaciado:** escala consistente (`4, 8, 16, 24, 32`) en toda la aplicación.
- **Retroalimentación:** el campo activo resalta su borde, el título muestra un contador de caracteres y los botones deshabilitados cambian de tono.
- **Estado vacío:** ícono minimalista y mensaje que indica cómo agregar la primera tarea.
- **Accesibilidad:** etiquetas de accesibilidad en campos y elementos de la lista, y contraste suficiente entre texto y fondo.

</details>

---

## Manejo de errores y validaciones

| Situación | Comportamiento |
|---|---|
| Título vacío al guardar | Se muestra el mensaje "Escribe un título para la tarea." y el borde del campo se resalta |
| Falla al guardar | Mensaje visible en el formulario; no se pierde lo escrito |
| Falla al cargar tareas | Mensaje de error en la pantalla principal |
| Falla al eliminar | Mensaje visible en la pantalla principal con el título de la tarea afectada |
| Eliminar una tarea | Diálogo de confirmación previo; funciona en móvil (`Alert`) y en web (`window.confirm`) |
| Lista sin tareas | Mensaje de estado vacío con indicación de cómo agregar la primera |
| Campos vacíos o correo con formato inválido en inicio de sesión | Mensaje claro en pantalla, sin bloquear la interfaz |
| Credenciales incorrectas | Mensaje único "Correo o contraseña incorrectos." |
| Registro con datos inválidos | Mensajes específicos: campos obligatorios, longitud mínima del nombre, formato de correo, requisitos de la contraseña y confirmación que no coincide |
| Correo ya registrado | Mensaje "Ya existe una cuenta registrada con ese correo." |
| Fecha u hora de vencimiento inválida | Validación de calendario real antes de guardar (`parseCustomDateTime`), con el motivo en pantalla |
| Fecha límite en el pasado al crear | Mensaje "La fecha límite debe ser posterior a la hora actual." |
| Permiso de cámara o GPS denegado | Mensaje visible en el formulario; no se cierra ni se rompe la aplicación y la tarea puede guardarse sin el adjunto |
| Error al abrir la cámara u obtener el GPS | Mensaje visible y la aplicación continúa funcionando |
| Error de red o HTTP al importar o sincronizar | Captura controlada con mensaje de error visible y conservación de los datos locales |
| Sesión no iniciada al importar, sincronizar o crear tareas | La operación se rechaza con un mensaje que pide iniciar sesión |

Tras guardar una tarea, los campos del formulario se restablecen y la aplicación vuelve a la lista, donde se ve la tarea recién agregada. Al abrir de nuevo "Nueva tarea", el formulario aparece vacío.

---

## Correspondencia con la rúbrica de la Unidad 2

La siguiente tabla indica dónde se evidencia cada indicador de la rúbrica de evaluación de la Unidad 2.

| Indicador | Qué implementa el proyecto | Dónde |
|---|---|---|
| **Periféricos del dispositivo** (cámara, GPS, sensores) | Captura de fotografía con compresión y vista previa; lectura de coordenadas GPS con precisión equilibrada; indicador de carga y manejo de errores. Optimización: temporizador con refresco adaptativo y listas virtualizadas. Patrones: Repository, Provider/Context, hooks personalizados y capa de servicio | `TaskFormScreen.tsx`, `devicePeripherals.ts`, `useCountdown.ts`, `TasksContext.tsx` |
| **Permisos de usuario** | Solicitud en el momento de uso, solo de los permisos necesarios (cámara y ubicación en primer plano), gestión de la negativa con mensajes y continuidad de la aplicación | `TaskFormScreen.tsx`, `devicePeripherals.ts` |
| **Pruebas de periféricos** | Pruebas de la validación de fechas y del temporizador, y de los servicios de periféricos del dispositivo | `__tests__/dateTime.test.ts`, `__tests__/devicePeripherals.test.ts` |
| **Integración con servicios web y APIs** | Importación (`GET`) y sincronización (`POST`) por HTTPS; transformación del DTO externo al modelo interno; estados de carga; manejo de errores HTTP y de red; marca de sincronización por tarea | `externalTaskApi.ts`, `TasksContext.tsx`, `TaskListScreen.tsx` |
| **Pruebas de integración con APIs** | Pruebas de importación y sincronización con `fetch` simulado | `__tests__/externalTaskApi.test.ts` |

---

## Nota sobre el framework

El enunciado original de la evaluación está planteado con Ionic (`ion-header`, `ion-content`, `ion-list`, `ion-item`, `ion-input`, `ion-button`). El proyecto se implementó con **React Native** y Expo, un stack más moderno. Estas son las equivalencias utilizadas:

| Ionic | React Native (este proyecto) |
|---|---|
| `ion-header` | Encabezado del `Stack.Navigator` |
| `ion-content` | `View` y `ScrollView` |
| `ion-list` | `FlatList` |
| `ion-item` | `ListItem` de `@rneui/themed` |
| `ion-input` | `TextInput` |
| `ion-button` | `Button` de `@rneui/themed` |
| Cámara / Geolocation (plugins de Capacitor) | `expo-image-picker` y `expo-location` |
| Servidor en `localhost:8100` | Servidor de Expo en el puerto `8081` (`npm run web` para el navegador) |

---

## Solución de problemas

| Problema | Posible solución |
|---|---|
| El teléfono no se conecta al servidor | Verifica que el teléfono y el equipo estén en la misma red Wi-Fi. Algunas redes aíslan a los clientes entre sí. Alternativa: `npx expo start --tunnel` |
| Conexión bloqueada por VPN o firewall | Desactiva la VPN o permite el puerto `8081`. Alternativa: `npx expo start --tunnel` (requiere `@expo/ngrok`) |
| Error de sesión en Expo Go al usar el túnel | Inicia sesión en la CLI con `npx expo login` (o define `EXPO_TOKEN`), o cierra la sesión en la aplicación Expo Go |
| El permiso de cámara o GPS no vuelve a aparecer en iOS | iOS guarda los permisos por aplicación (Expo Go). Puedes restablecerlos en Configuración → Expo Go |
| Permiso de cámara o ubicación denegado en Android | Actívalo manualmente en Ajustes → Aplicaciones → Expo Go → Permisos |
| Error de peer dependencies al instalar | Usa `npm install` desde la carpeta del proyecto para que se aplique el `.npmrc` incluido (`legacy-peer-deps=true`) |
| Docker no inicia por falta de `HOST_IP` | Copia `.env.example` como `.env` y define la IP local de tu equipo |
| Cambios de dependencias no se reflejan en Docker | Ejecuta `docker compose down -v && docker compose up --build` |
| Caché de Metro desactualizada | Ejecuta `npx expo start --clear` |
| Las cuentas o tareas desaparecen al reiniciar | Es el comportamiento esperado: en esta versión los datos se guardan en memoria |


---

## Evolución del proyecto

- **Versión 1.0 (Unidad N.º 1):** arquitectura base en React Native + TypeScript, navegación en pila, `TasksContext`, patrón `TaskRepository` en memoria, CRUD completo de tareas y paleta clara neutra.
- **Versión 2.0 (Unidad N.º 2):** autenticación con contraseñas cifradas (`bcryptjs` + `expo-crypto`), tareas aisladas por usuario, captura de fotografía con la cámara (`expo-image-picker`), geolocalización GPS (`expo-location`) con gestión de permisos, fechas de vencimiento con temporizador en vivo, estado completado, importación y sincronización con una API externa, tema oscuro "hacker" y suite de 5 archivos de pruebas unitarias con Jest (11 pruebas).

---

## Evidencias

### Parte 1 — Versión 1.0

Las siguientes capturas corresponden a la **versión 1.0** (tema claro).

Vista de tareas:  

<img width="532" height="767" alt="Image" src="https://github.com/user-attachments/assets/1710af1f-8bb1-4100-9b8b-88626682c466" />

Validación del formulario de una nueva tarea:  

<img width="534" height="775" alt="Image" src="https://github.com/user-attachments/assets/503b0544-e330-4619-9664-da22fae6e403" />

Nueva tarea:  

<img width="534" height="775" alt="Image" src="https://github.com/user-attachments/assets/3ae4a5be-a0df-4ac5-9a5e-c957947eb48b" />

Vista de tareas con la nueva tarea creada:  

<img width="534" height="775" alt="Image" src="https://github.com/user-attachments/assets/1ca15f4a-3103-48aa-a9ac-f326c5fb619e" />

Editar tarea:  

<img width="537" height="777" alt="Image" src="https://github.com/user-attachments/assets/dd904cdd-2594-41db-b829-ac1b7fa2db07" />

Vista de tareas luego de la actualización:  

<img width="537" height="777" alt="Image" src="https://github.com/user-attachments/assets/9b53657f-a75c-4f60-b01b-4c841dd3d3cc" />

Eliminación de tarea:  

<img width="537" height="777" alt="Image" src="https://github.com/user-attachments/assets/b37c65c1-4f84-4f3b-a081-0ec714579605" />

---

### Parte 2 — Versión 2.0

Capturas de la **versión 2.0** (tema oscuro). Reemplaza cada línea `> Pegar imagen aquí` por la captura correspondiente.

**Cuentas y sesión**

Inicio de sesión:  
> 

Registro con la lista de requisitos de contraseña en tiempo real:  
> 

Credenciales incorrectas (mensaje único):  
> 

**Tareas**

Lista de tareas del usuario con resumen, temporizador y estado de sincronización:  
> 

Formulario de nueva tarea con fecha límite, foto y GPS:  
> 

Tarea con foto y coordenadas en la lista:  
> 

Estados del temporizador (normal, urgente, expirada, completada):  
> 

Aislamiento por usuario (dos cuentas, listas distintas):  
> 

**Periféricos y permisos**

Solicitud de permiso de cámara:  
> 

Permiso denegado: mensaje visible y la tarea se puede guardar sin foto:  
> 

Solicitud de permiso de ubicación y GPS obtenido:  
> 

**Servicios web**

Importación desde la API externa:  
> 

Sincronización completa:  
> 

**Pruebas y comprobación de tipos**

Resultado de `npm test` (5 suites, 11 pruebas aprobadas):  
> 

Resultado de `npm run typecheck` sin errores:  
> 

---

## Licencia

Proyecto académico desarrollado por **Fabiola Leal** — Instituto Profesional San Sebastián (2026).

El repositorio incluye un archivo `LICENSE` con la licencia MIT heredada de la plantilla de Expo.

Se utilizaó IA