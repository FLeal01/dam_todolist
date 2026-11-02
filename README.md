<img width="2455" height="1651" alt="Image" src="https://github.com/user-attachments/assets/0a2e96c1-9acf-45d2-8c58-4bfa0c193556" />  


# To Do List
Autora: Fabiola Leal, estudiante de Ingeniería en Informática.
---
Aplicación móvil de gestión de tareas pendientes desarrollada con **React Native**, **Expo** y **TypeScript**. Permite registrar, visualizar, editar y eliminar tareas, cada una con un título y una descripción.

Proyecto desarrollado para la **Evaluación Sumativa Unidad N.º 1** de la asignatura *Desarrollo de Aplicaciones Móviles* (Instituto Profesional San Sebastián). Es la base sobre la que se construirán las funcionalidades de las siguientes unidades: almacenamiento local, autenticación de usuarios y consumo de APIs externas.

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
10. [Diseño de la interfaz](#diseño-de-la-interfaz)
11. [Manejo de errores y validaciones](#manejo-de-errores-y-validaciones)
12. [Nota sobre el framework](#nota-sobre-el-framework)
13. [Solución de problemas](#solución-de-problemas)
14. [Evolución del proyecto](#evolución-del-proyecto)
15. [Evidencias](#evidencias)

---

## Características

- **Lista de tareas** con una tarjeta por tarea que muestra título y descripción.
- **Agregar tareas** mediante un formulario con campos de título y descripción. Los campos se limpian después de guardar.
- **Editar tareas** reutilizando el mismo formulario en modo edición.
- **Eliminar tareas** con un botón junto a cada una y confirmación previa.
- **Validación**: el título es obligatorio; la descripción es opcional.
- **Estados de interfaz**: indicador de carga, mensaje de lista vacía y mensajes de error visibles para el usuario.
- **Arquitectura preparada para crecer**: el acceso a datos está aislado detrás de una interfaz, de modo que cambiar la fuente de datos no obliga a modificar las pantallas.

---

## Stack tecnológico

| Área | Tecnología |
|---|---|
| Framework móvil | React Native 0.88 con Expo SDK 58 |
| Biblioteca de UI base | React 19 (componentes funcionales y hooks) |
| Lenguaje | TypeScript (modo `strict`) |
| Componentes de interfaz | React Native Elements (`@rneui/themed`) y componentes nativos de React Native |
| Navegación | React Navigation (`native-stack`) |
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

---

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm start` | Inicia el servidor de desarrollo de Expo |
| `npm run android` | Inicia Expo y abre la app en Android |
| `npm run ios` | Inicia Expo y abre la app en iOS |
| `npm run web` | Inicia Expo y abre la versión web |
| `npm run typecheck` | Comprueba los tipos de TypeScript sin generar archivos |

---

## Estructura del proyecto

```
to-do-list/
├── App.tsx                        Punto de entrada: navegación, tema y proveedor de estado
├── index.ts                       Registro del componente raíz en Expo
├── app.json                       Configuración de la aplicación Expo
├── package.json                   Dependencias y scripts
├── tsconfig.json                  Configuración de TypeScript (strict)
├── Dockerfile                     Imagen de desarrollo
├── docker-compose.yml             Servicio, puertos y volúmenes
├── .env.example                   Plantilla de variables de entorno (HOST_IP)
├── .npmrc                         Configuración de npm (legacy-peer-deps)
├── assets/                        Íconos y recursos gráficos
└── src/
    ├── components/
    │   ├── TaskItem.tsx           Tarjeta de una tarea (título, descripción, acciones)
    │   └── EmptyState.tsx         Mensaje cuando no hay tareas
    ├── context/
    │   └── TasksContext.tsx       Estado de tareas y funciones add / update / delete
    ├── screens/
    │   ├── TaskListScreen.tsx     Pantalla principal con la lista de tareas
    │   └── TaskFormScreen.tsx     Formulario de creación y edición
    ├── services/
    │   ├── taskRepository.ts      Interfaz (contrato) de acceso a datos
    │   └── memoryTaskRepository.ts Implementación en memoria
    ├── theme/
    │   └── theme.ts               Colores, espaciado, radios, tipografía y sombras
    ├── types/
    │   ├── task.ts                Tipos Task, NewTask y TaskUpdate
    │   └── navigation.ts          Tipos de las rutas de navegación
    └── utils/
        ├── confirm.ts             Diálogo de confirmación multiplataforma
        └── createId.ts            Generador de identificadores únicos
```

---

## Arquitectura y patrones de diseño

La aplicación separa responsabilidades en capas, de modo que cada archivo tiene un propósito claro.

| Capa | Ubicación | Responsabilidad |
|---|---|---|
| Presentación | `screens/`, `components/` | Mostrar datos y capturar la interacción del usuario |
| Estado | `context/` | Mantener la lista de tareas y exponer las operaciones |
| Acceso a datos | `services/` | Leer y escribir tareas detrás de una interfaz |
| Soporte | `types/`, `theme/`, `utils/` | Tipos, estilos y utilidades compartidas |

### Patrones aplicados

- **Componentes funcionales y hooks.** Toda la interfaz se construye con funciones y los hooks `useState`, `useEffect`, `useCallback`, `useMemo` y `useContext`.
- **Context API con Provider (`TasksContext`).** El estado de las tareas vive en un único proveedor y se consume desde cualquier pantalla con el hook `useTasks()`, evitando pasar datos por múltiples niveles (prop drilling). El hook lanza un error si se usa fuera del proveedor.
- **Patrón Repository (`TaskRepository`).** Una interfaz define las operaciones `getAll`, `create`, `update` y `remove`. Hoy se implementa en memoria; las próximas unidades añadirán implementaciones locales o con API sin reescribir las pantallas. El proveedor recibe el repositorio por props, lo que permite sustituirlo (inyección de dependencias).
- **Separación entre pantallas y componentes de presentación.** Las pantallas (`screens/`) coordinan estado y navegación; los componentes (`components/`) reciben datos y callbacks por props y no conocen el origen de la información.
- **Componentes controlados.** Los campos `TextInput` están ligados al estado de React mediante `value` y `onChangeText`.
- **Comunicación hijo a padre mediante props.** `TaskItem` notifica las acciones del usuario con los callbacks `onEdit` y `onDelete`.
- **Reutilización de pantalla.** `TaskFormScreen` sirve para crear y para editar: el modo se determina según si recibe una tarea como parámetro de navegación.
- **Navegación en pila tipada.** React Navigation (`native-stack`) con un `RootStackParamList` que tipa las rutas y sus parámetros.
- **Virtualización de listas.** `FlatList` renderiza solo los elementos visibles, lo que mantiene el rendimiento con listas largas.
- **Sistema de diseño centralizado.** Colores, espaciado, radios y tipografía se definen una sola vez en `theme/theme.ts`.

---

## Componentes principales

| Componente | Origen | Uso en la aplicación |
|---|---|---|
| `NavigationContainer` y `Stack.Navigator` | React Navigation | Navegación entre lista y formulario; el encabezado de cada pantalla |
| `FlatList` | React Native | Lista de tareas con renderizado eficiente |
| `ListItem` | `@rneui/themed` | Tarjeta de cada tarea con título y descripción |
| `TextInput` | React Native | Campos de título y descripción |
| `Button` | `@rneui/themed` | Guardar, actualizar, crear y las acciones Editar y Eliminar |
| `KeyboardAvoidingView` y `ScrollView` | React Native | Formulario que no queda tapado por el teclado |
| `ActivityIndicator` | React Native | Indicador de carga |
| `SafeAreaProvider` y `SafeAreaView` | `react-native-safe-area-context` | Respeta las áreas seguras del dispositivo |

---

## Modelo de datos

```ts
type Task = {
  id: string;          // identificador único
  title: string;       // obligatorio
  description: string; // opcional
};

type NewTask = Omit<Task, 'id'>;
type TaskUpdate = Partial<NewTask>;
```

Contrato de acceso a datos:

```ts
interface TaskRepository {
  getAll(): Promise<Task[]>;
  create(data: NewTask): Promise<Task>;
  update(id: string, data: TaskUpdate): Promise<Task>;
  remove(id: string): Promise<void>;
}
```

Las tareas se almacenan **en memoria**: se pierden al cerrar la aplicación. La persistencia se incorporará en la unidad de almacenamiento local.

---

## Diseño de la interfaz

El diseño busca una estética sobria, elegante y serena, basada en colores neutros.

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

Tras guardar una tarea, los campos del formulario se restablecen y la aplicación vuelve a la lista, donde se ve la tarea recién agregada. Al abrir de nuevo "Nueva tarea", el formulario aparece vacío.

---

## Nota sobre el framework

El enunciado original de la evaluación está planteado con Ionic (`ion-header`, `ion-content`, `ion-list`, `ion-item`, `ion-input`, `ion-button`). Por indicación del profesor, el proyecto se implementó con **React Native**. Estas son las equivalencias utilizadas:

| Ionic | React Native (este proyecto) |
|---|---|
| `ion-header` | Encabezado del `Stack.Navigator` |
| `ion-content` | `View` y `ScrollView` |
| `ion-list` | `FlatList` |
| `ion-item` | `ListItem` de `@rneui/themed` |
| `ion-input` | `TextInput` |
| `ion-button` | `Button` de `@rneui/themed` |
| Servidor en `localhost:8100` | Servidor de Expo en el puerto `8081` (`npm run web` para el navegador) |

---

## Solución de problemas

| Problema | Posible solución |
|---|---|
| El teléfono no se conecta al servidor | Verifica que el teléfono y el equipo estén en la misma red Wi-Fi. Algunas redes aíslan a los clientes entre sí |
| Conexión bloqueada por VPN o firewall | Desactiva la VPN o permite el puerto `8081`. Alternativa: `npx expo start --tunnel` (requiere `@expo/ngrok`) |
| Error de peer dependencies al instalar | Usa `npm install` desde la carpeta del proyecto para que se aplique el `.npmrc` incluido |
| Docker no inicia por falta de `HOST_IP` | Copia `.env.example` como `.env` y define la IP local de tu equipo |
| Cambios de dependencias no se reflejan en Docker | Ejecuta `docker compose down -v && docker compose up --build` |
| Caché de Metro desactualizada | Ejecuta `npx expo start --clear` |

---
## Evidencias
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

