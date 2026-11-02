# Plan: App móvil To Do List (React Native + Expo)

## Estado de implementación

Proyecto generado con **Expo SDK 58**, React 19 y TypeScript, nombre de la app: **To Do List**.

- Hecho: Fases 0 a 6 (lista, formulario, agregar, editar, eliminar con confirmación, diseño sobrio) y archivos Docker.
- Verificado: `tsc --noEmit` sin errores y empaquetado correcto para Android y web con `expo export`.
- Pendiente de tu parte: probar en un dispositivo con Expo Go y ejecutar `docker compose up --build` (Docker no se pudo ejecutar en el entorno donde se generó el proyecto).
- No incluido: Fase 7 (persistencia opcional), reservada para la unidad de almacenamiento local.
- Detalles que difieren del borrador: `.npmrc` con `legacy-peer-deps=true` por un conflicto de peer dependencies en `@rneui/base`, y soporte web instalado (`react-native-web`) como alternativa.

---

## 1. Análisis del brief

### 1.1 Objetivo
Construir una app móvil de tareas pendientes con React Native y Expo, con un aspecto moderno y una paleta sobria y elegante. La app permite **registrar, visualizar, editar y eliminar** tareas.

### 1.2 Requisitos extraídos

| # | Requisito | Tipo | Origen en el brief |
|---|-----------|------|--------------------|
| R1 | App móvil con React Native + Expo | Tecnológico | Párrafo inicial |
| R2 | Usar React como framework frontend | Tecnológico | "Además de las tecnologías dichas…" |
| R3 | Diseño moderno, colores sobrios y elegantes | No funcional | Párrafo inicial |
| R4 | Cada tarea tiene **título** y **descripción** | Datos | Párrafo inicial |
| R5 | Pantalla principal con lista de tareas | Funcional | Página de lista |
| R6 | Cada tarea se muestra como un `ListItem` (título + descripción) | UI | Página de lista |
| R7 | Formulario con `TextInput` para título y descripción | UI | Formulario |
| R8 | Botón de guardar con `Button` | UI | Formulario |
| R9 | Agregar tarea y **limpiar los campos** tras guardar | Funcional | Agregar tarea |
| R10 | Botón de eliminar junto a cada tarea; elimina solo esa tarea | Funcional | Eliminar tarea |
| R11 | Editar tareas | Funcional | Párrafo inicial |

### 1.3 Ambigüedades y decisiones tomadas

1. **Editar tarea (R11):** se menciona en la introducción pero no aparece en el detalle de funciones básicas. **Decisión:** implementarlo, ya que es parte del alcance declarado. Se hará reutilizando el mismo formulario en "modo edición".
2. **"Framework frontend React":** React Native ya está basado en React, por lo que R2 se cumple de forma natural (componentes funcionales + hooks). No se necesita nada adicional.
3. **`ListItem`:** no existe en el núcleo de React Native; proviene de **React Native Elements (`@rneui/themed`)**. **Decisión:** usar `ListItem` de `@rneui/themed`. Alternativa de respaldo: componente propio `ListItem` con `View` + `Text`.
4. **Persistencia:** el brief no la exige. **Decisión:** el MVP guarda las tareas en estado de React (en memoria). Como mejora opcional se añade `AsyncStorage` para que las tareas sobrevivan al cerrar la app.
5. **Ubicación del formulario:** el brief no dice si va en pantalla aparte o junto a la lista. **Decisión:** dos pantallas (Lista y Formulario) con navegación, o alternativamente un modal. Se prioriza la opción más simple y limpia visualmente.
6. **Validación:** no se especifica. **Decisión:** el título es obligatorio; la descripción es opcional.
7. **Marcar como completada:** no está en el brief. **Fuera de alcance** (posible mejora futura).

### 1.4 Alcance

**Dentro:** crear, listar, editar y eliminar tareas; formulario con validación básica; diseño sobrio y moderno.

**Fuera de esta unidad (se abordarán en unidades posteriores):** almacenamiento local, autenticación de usuarios y comunicación con APIs externas. Ver la sección 10, "Evolución del proyecto".

**Dentro como herramienta de entorno:** Docker para el entorno de desarrollo (sección 5).

**Fuera del alcance general por ahora:** notificaciones, categorías, fechas de vencimiento, marcar como completada.

---

## 2. Stack tecnológico

| Área | Elección |
|------|----------|
| Framework móvil | React Native + Expo (SDK actual) |
| Lenguaje | **TypeScript** (modo `strict`) |
| UI base | React 18+ con componentes funcionales y hooks |
| Componentes UI | `@rneui/themed` (`ListItem`) + `Button` y `TextInput` de React Native |
| Navegación | `@react-navigation/native` + `native-stack` |
| Estado | `useState` / `useReducer` (opcional: Context API) |
| Persistencia (opcional) | `@react-native-async-storage/async-storage` |
| IDs | `Date.now().toString()` o `expo-crypto` (`randomUUID`) |
| Contenedores | **Docker** + Docker Compose (entorno de desarrollo, ver sección 5) |

---

## 3. Modelo de datos

```ts
type Task = {
  id: string;          // identificador único
  title: string;       // obligatorio
  description: string; // opcional
};
```

Operaciones sobre la lista `tasks: Task[]`:

- **add(task):** `[...tasks, newTask]`
- **update(id, data):** `tasks.map(t => t.id === id ? { ...t, ...data } : t)`
- **remove(id):** `tasks.filter(t => t.id !== id)`

### 3.1 Convenciones de TypeScript

- **Modo estricto:** `"strict": true` en `tsconfig.json` (la plantilla `blank-typescript` de Expo ya lo extiende de `expo/tsconfig.base`).
- **Sin `any`:** tipar props, estado, contexto y funciones. Usar `unknown` y validar cuando un dato venga de fuera (almacenamiento o API en unidades futuras).
- **Tipos compartidos en `src/types/`:** `Task`, y tipos derivados como `NewTask = Omit<Task, 'id'>` y `TaskUpdate = Partial<NewTask>`.
- **Componentes funcionales tipados:** props definidas con `type` o `interface`.
  ```tsx
  type TaskItemProps = {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
  };

  export default function TaskItem({ task, onEdit, onDelete }: TaskItemProps) { /* ... */ }
  ```
- **Navegación tipada:** definir un `RootStackParamList` y usar `NativeStackScreenProps`.
  ```ts
  export type RootStackParamList = {
    TaskList: undefined;
    TaskForm: { task?: Task };   // sin task = crear; con task = editar
  };
  ```
- **Contexto tipado:** definir `TasksContextValue` y un hook `useTasks()` que lance un error si se usa fuera del proveedor, evitando comprobaciones de `undefined` en las pantallas.
- **Estado con tipo explícito:** `useState<Task[]>([])`, `useState<string | null>(null)`.
- **Eventos y estilos:** usar los tipos de React Native (`StyleSheet.create`, `TextInputProps`) en lugar de objetos sin tipar.
- **Beneficio a futuro:** la interfaz `TaskRepository` (sección 10.1) actúa como contrato tipado entre memoria, almacenamiento local y API.

---

## 4. Arquitectura y estructura de carpetas

```
todo-app/
├── App.tsx                    # Punto de entrada, navegación y proveedor de estado
├── app.json
├── package.json
├── Dockerfile                 # Imagen de desarrollo (ver sección 5)
├── docker-compose.yml         # Servicio app, puertos y volúmenes
├── .dockerignore
├── .env.example               # Plantilla de variables (p. ej. HOST_IP)
└── src/
    ├── screens/
    │   ├── TaskListScreen.tsx     # Pantalla principal con la lista
    │   └── TaskFormScreen.tsx     # Formulario (crear / editar)
    ├── components/
    │   ├── TaskItem.tsx           # ListItem de una tarea (título, descripción, acciones)
    │   └── EmptyState.tsx         # Mensaje cuando no hay tareas
    ├── context/
    │   └── TasksContext.tsx       # Estado global y funciones add/update/remove
    ├── services/                  # Capa de acceso a datos (preparada para el futuro)
    │   └── taskRepository.ts      # Interfaz de datos; hoy en memoria, mañana local o API
    ├── theme/
    │   └── theme.ts               # Colores, espaciados, tipografía
    └── types/
        └── task.ts                # Tipo Task
```

### Flujo de navegación

```
[TaskListScreen] ──(botón "Nueva tarea")──▶ [TaskFormScreen] (crear)
       │                                          │
       ├──(tocar tarea / botón editar)──▶ [TaskFormScreen] (editar, con datos)
       │                                          │
       └──(botón eliminar)──▶ elimina tarea       └──(guardar)──▶ vuelve a la lista
```

---

## 5. Entorno de desarrollo con Docker

Se usará **Docker** para que cualquier persona del equipo (o el evaluador) pueda levantar el proyecto con el mismo entorno, sin instalar Node ni Expo CLI de forma local.

### 5.1 Qué se contenedoriza y qué no

| Se ejecuta en Docker | Se ejecuta fuera de Docker |
|----------------------|----------------------------|
| Node.js, dependencias (`npm ci`) y Metro bundler / servidor de desarrollo de Expo | La app en sí: **Expo Go** en un teléfono real, o un emulador/simulador del equipo anfitrión |
| Comprobaciones de calidad: `tsc --noEmit`, lint, pruebas | Emuladores de Android e iOS (no corren dentro de Docker) |
| (Futuro) backend, API local y base de datos | |

> Docker no reemplaza el dispositivo o emulador: el contenedor sirve el bundle y el teléfono se conecta a él por red.

### 5.2 Archivos nuevos

- `Dockerfile`: imagen de desarrollo basada en una versión LTS de Node compatible con el SDK de Expo elegido (`node:22-slim`).
- `docker-compose.yml`: define el servicio `app`, puertos, variables de entorno y volúmenes.
- `.dockerignore`: excluye `node_modules`, `.expo`, `dist`, `.git` y archivos locales.

Borrador del `Dockerfile`:

```dockerfile
FROM node:22-slim
ENV EXPO_NO_TELEMETRY=1
WORKDIR /app

COPY package.json package-lock.json .npmrc ./
RUN npm ci

COPY . .

EXPOSE 8081
CMD ["npx", "expo", "start", "--host", "lan"]
```

Borrador del `docker-compose.yml`:

```yaml
services:
  app:
    build: .
    ports:
      - "8081:8081"
    environment:
      # IP de la máquina anfitriona en la red local (para que el teléfono llegue al bundler)
      - REACT_NATIVE_PACKAGER_HOSTNAME=${HOST_IP}
    volumes:
      - .:/app              # recarga en caliente al editar el código
      - /app/node_modules   # evita pisar las dependencias del contenedor
    stdin_open: true
    tty: true
```

### 5.3 Flujo de trabajo

1. Averiguar la IP local del equipo anfitrión y exportarla como `HOST_IP` (o ponerla en un archivo `.env`).
2. Levantar el entorno: `docker compose up --build`.
3. Escanear el código QR con **Expo Go** (teléfono y equipo en la misma red Wi-Fi).
4. Editar el código en el equipo anfitrión; el volumen sincroniza los cambios con el contenedor.
5. Ejecutar comprobaciones dentro del contenedor, por ejemplo: `docker compose run --rm app npx tsc --noEmit`.

### 5.4 Puntos de atención

- **Red:** el teléfono debe alcanzar la IP del anfitrión. Si la red lo impide (Wi-Fi con aislamiento de clientes, VPN, firewall), usar el modo túnel de Expo (`--tunnel`, requiere `@expo/ngrok`) o la versión web.
- **Docker Desktop (Windows/macOS):** el contenedor corre dentro de una máquina virtual, por lo que sin `REACT_NATIVE_PACKAGER_HOSTNAME` el QR puede apuntar a una IP interna inalcanzable.
- **Recarga de archivos:** en volúmenes montados en Windows/macOS la detección de cambios puede ser más lenta o requerir ajustes.
- **Dependencias nativas:** el contenedor puede mezclar `node_modules` del anfitrión y del contenedor; por eso se usa el volumen anónimo para `node_modules` y `.dockerignore`.
- **Producción:** esta imagen es solo de desarrollo. Las compilaciones para tiendas se harían con EAS Build u otro proceso aparte, fuera del alcance de esta unidad.

---

## 6. Diseño visual (sobrio y elegante)

### Paleta propuesta

| Rol | Color | Hex |
|-----|-------|-----|
| Fondo | Gris muy claro | `#F5F6F8` |
| Superficie (tarjetas) | Blanco | `#FFFFFF` |
| Texto principal | Azul pizarra oscuro | `#1F2937` |
| Texto secundario | Gris medio | `#6B7280` |
| Color de acento / botón principal | Azul marino | `#1E3A5F` |
| Bordes / divisores | Gris claro | `#E5E7EB` |
| Acción eliminar | Rojo apagado | `#B91C1C` |

### Lineamientos de UI

- Tarjetas blancas con esquinas redondeadas (`borderRadius` 12–16) y sombra muy suave.
- Espaciado generoso (múltiplos de 8).
- Jerarquía tipográfica clara: título en semibold, descripción en gris y menor tamaño (máx. 2 líneas con `numberOfLines`).
- Un solo color de acento para mantener la sobriedad.
- `StatusBar` acorde al fondo; `SafeAreaView` en todas las pantallas.
- Estado vacío con texto amable ("Aún no tienes tareas").

---

## 7. Plan de implementación por fases

### Fase 0 — Preparación del proyecto
- [ ] Crear proyecto: `npx create-expo-app todo-app --template blank-typescript`
- [ ] Instalar dependencias:
  ```bash
  npx expo install react-native-screens react-native-safe-area-context @react-native-async-storage/async-storage
  npm install @react-navigation/native @react-navigation/native-stack @rneui/themed @rneui/base
  ```
- [ ] Verificar que la app arranca con `npx expo start` (Expo Go o emulador).
- [ ] Crear `Dockerfile`, `docker-compose.yml`, `.dockerignore` y `.env.example` (sección 5).
- [ ] Verificar que `docker compose up --build` levanta Metro y que Expo Go se conecta desde el teléfono.
- [ ] Verificar que `docker compose run --rm app npx tsc --noEmit` se ejecuta dentro del contenedor.

### Fase 1 — Base del proyecto
- [ ] Crear estructura de carpetas (sección 4).
- [ ] Verificar `tsconfig.json` con `"strict": true`.
- [ ] Definir los tipos `Task`, `NewTask` y `TaskUpdate`, y el archivo de tema (`theme.ts`).
- [ ] Configurar navegación (stack con dos pantallas) con `RootStackParamList` tipado.

### Fase 2 — Estado de tareas
- [ ] Definir la interfaz `TaskRepository` e implementarla en memoria (ver sección 10.1).
- [ ] Crear `TasksContext` con `tasks`, `loading`, `error`, `addTask`, `updateTask`, `deleteTask`, apoyado en el repositorio.
- [ ] Envolver la app con el proveedor.

### Fase 3 — Pantalla de lista (R5, R6, R10)
- [ ] Renderizar tareas con `FlatList`.
- [ ] Crear `TaskItem` con `ListItem` (título + descripción).
- [ ] Añadir botón de eliminar junto a cada tarea.
- [ ] Añadir `EmptyState` y botón para ir al formulario.

### Fase 4 — Formulario (R7, R8, R9)
- [ ] Dos `TextInput` (título y descripción; descripción multilínea).
- [ ] Botón "Guardar" con `Button`.
- [ ] Validar que el título no esté vacío.
- [ ] Al guardar: agregar tarea, **limpiar los campos** y volver a la lista.

### Fase 5 — Edición (R11)
- [ ] Pasar la tarea seleccionada al formulario por parámetros de navegación.
- [ ] Precargar los campos y cambiar el texto del botón a "Actualizar".
- [ ] Llamar a `updateTask` al guardar.

### Fase 6 — Pulido visual (R3)
- [ ] Aplicar paleta, sombras, espaciado y tipografía.
- [ ] Confirmación antes de eliminar (`Alert.alert`).
- [ ] Manejo del teclado (`KeyboardAvoidingView`).

### Fase 7 — Persistencia opcional
- [ ] Guardar y cargar tareas con `AsyncStorage` dentro del contexto.

### Fase 8 — Pruebas y entrega
- [ ] Ejecutar la lista de verificación de la sección 8.
- [ ] Probar en Android e iOS (o emulador).
- [ ] Probar el arranque desde cero en una máquina limpia usando solo Docker.
- [ ] Escribir un `README.md` con instrucciones de instalación y ejecución (con y sin Docker), incluyendo cómo obtener `HOST_IP`.

---

## 8. Criterios de aceptación

- [ ] La app se ejecuta con Expo sin errores.
- [ ] La pantalla principal muestra la lista de tareas con título y descripción en un `ListItem`.
- [ ] El formulario usa `TextInput` para título y descripción, y `Button` para guardar.
- [ ] Al guardar, la tarea aparece en la lista y los campos del formulario quedan vacíos.
- [ ] No se puede guardar una tarea sin título.
- [ ] Cada tarea tiene un botón de eliminar que borra únicamente esa tarea.
- [ ] Es posible editar el título y la descripción de una tarea existente.
- [ ] El diseño es consistente, moderno y con colores sobrios.
- [ ] El proyecto utiliza React (componentes funcionales y hooks).
- [ ] El proyecto está escrito en TypeScript y `npx tsc --noEmit` termina sin errores ni usos de `any`.
- [ ] `docker compose up --build` levanta el entorno de desarrollo y la app se abre en Expo Go.
- [ ] El `README.md` documenta cómo ejecutar el proyecto con Docker.

---

## 9. Riesgos y mitigaciones

| Riesgo | Mitigación |
|--------|------------|
| Incompatibilidad de `@rneui/themed` con la versión de Expo | Fijar versiones estables; si falla, crear un `ListItem` propio con `View` y `Text`. |
| Pérdida de datos al cerrar la app (sin persistencia) | Implementar la Fase 7 con `AsyncStorage`. |
| Alcance ambiguo en "editar" | Decisión documentada en la sección 1.3; implementar con formulario reutilizable. |
| Teclado tapando los campos en móvil | Usar `KeyboardAvoidingView` y `ScrollView` en el formulario. |
| El teléfono no alcanza el bundler dentro de Docker | Definir `REACT_NATIVE_PACKAGER_HOSTNAME` con la IP local; alternativa: `--tunnel` o versión web. |
| Recarga en caliente lenta con volúmenes montados | Revisar el montaje de volúmenes y, si hace falta, ajustar la detección de cambios; mantener `node_modules` en volumen anónimo. |
| Esperar que Docker ejecute emuladores móviles | Aclarar en el README que la app se ve en Expo Go o en un emulador del anfitrión. |

---

## 10. Evolución del proyecto

El proyecto se ampliará en las siguientes unidades con **almacenamiento local, autenticación de usuarios y comunicación con APIs externas**. Aunque nada de esto se implementa ahora, el diseño de esta unidad debe facilitar esos cambios sin reescribir la app.

### 10.1 Principios de diseño para no cerrar puertas

1. **Separar la UI de los datos.** Las pantallas nunca manipulan el arreglo de tareas directamente; siempre pasan por `TasksContext`, y este se apoya en `services/taskRepository.ts`.
2. **Definir una interfaz de repositorio.** Un contrato simple que hoy se implementa en memoria y después puede cambiar de fuente sin tocar las pantallas:
   ```ts
   interface TaskRepository {
     getAll(): Promise<Task[]>;
     create(data: Omit<Task, 'id'>): Promise<Task>;
     update(id: string, data: Partial<Omit<Task, 'id'>>): Promise<Task>;
     remove(id: string): Promise<void>;
   }
   ```
3. **Usar operaciones asíncronas desde el inicio.** Aunque en memoria no hace falta, devolver `Promise` evita cambios grandes cuando lleguen el almacenamiento y las APIs.
4. **Contemplar estados de carga y error** en el contexto (`loading`, `error`), que serán necesarios al hablar con disco o red.
5. **IDs generados de forma independiente** (por ejemplo UUID), no basados en la posición en el arreglo, para poder sincronizar con un servidor más adelante.

### 10.2 Cómo encaja cada ampliación

| Unidad futura | Qué se añadirá | Dónde impacta | Preparación en esta unidad |
|---------------|----------------|---------------|----------------------------|
| Almacenamiento local | Persistir tareas en el dispositivo (`AsyncStorage` o `expo-sqlite`) | Nueva implementación de `TaskRepository` | Interfaz de repositorio y métodos asíncronos |
| Autenticación de usuarios | Registro, inicio de sesión, sesión persistente y tareas por usuario | Nuevo `AuthContext`, pantallas Login/Registro, navegación condicionada, campo `userId` en `Task` | Navegación en stack fácil de extender; contextos separados por responsabilidad |
| APIs externas | Consumo de un backend o servicio REST, sincronización | Nueva implementación de `TaskRepository` basada en HTTP, capa `api/` con cliente y manejo de errores | Estados `loading`/`error` y IDs independientes |

**Impacto de Docker:** `docker-compose.yml` es el punto natural para añadir servicios cuando lleguen las unidades siguientes, por ejemplo un servicio `api` (backend local o mock) y un servicio `db` (base de datos), con redes y variables de entorno compartidas. La app móvil seguirá corriendo en Expo Go o emulador y consumirá la API por la IP del anfitrión, no por `localhost`.

### 10.3 Estructura esperada a futuro (referencia)

```
src/
├── api/              # Cliente HTTP y endpoints (unidad de APIs)
├── services/
│   ├── taskRepository.ts          # Interfaz
│   ├── memoryTaskRepository.ts    # Unidad actual
│   ├── localTaskRepository.ts     # Unidad de almacenamiento local
│   └── apiTaskRepository.ts       # Unidad de APIs externas
├── context/
│   ├── TasksContext.tsx
│   └── AuthContext.tsx            # Unidad de autenticación
└── screens/
    ├── LoginScreen.tsx
    └── RegisterScreen.tsx
```

### 10.4 Decisiones que se pueden posponer

- Elegir entre `AsyncStorage` y `expo-sqlite` (depende de cuántos datos y qué consultas se necesiten).
- Elegir proveedor de autenticación (propio, Firebase, Supabase, etc.).
- Estrategia de sincronización y manejo de conflictos entre datos locales y remotos.
- Gestión segura de tokens (`expo-secure-store`).
- Imagen y motor de base de datos para el entorno Docker (si se usa un backend propio).
- Si el proyecto necesitará una imagen de producción o integración continua con Docker.

> **Nota sobre la Fase 7:** la persistencia con `AsyncStorage` queda opcional en esta unidad. Si se implementa, debe hacerse como una implementación del repositorio, no directamente dentro de las pantallas, para que sirva de base a la unidad de almacenamiento local.

---

## 11. Mejoras futuras (fuera del MVP)

- Marcar tareas como completadas.
- Búsqueda y filtros.
- Fechas de vencimiento y recordatorios.
- Modo oscuro.
- Sincronización con backend.
