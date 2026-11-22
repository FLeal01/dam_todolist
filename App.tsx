import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, createTheme } from '@rneui/themed';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { TasksProvider } from './src/context/TasksContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import TaskFormScreen from './src/screens/TaskFormScreen';
import TaskListScreen from './src/screens/TaskListScreen';
import { colors, fonts, radius, typography } from './src/theme/theme';
import type { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const uiTheme = createTheme({
  lightColors: { primary: colors.primary },
  components: {
    Button: {
      buttonStyle: {
        backgroundColor: colors.primary,
        borderRadius: radius.md,
        paddingVertical: 14,
      },
      titleStyle: {
        ...typography.label,
        color: colors.primaryText,
      },
    },
  },
});

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.background,
    primary: colors.primary,
    border: colors.border,
  },
};

function RootNavigator() {
  const { currentUser } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerShadowVisible: false,
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text, fontFamily: fonts.serif, fontSize: 20, fontWeight: '600' },
      }}
    >
      {currentUser ? (
        <>
          <Stack.Screen
            name="TaskList"
            component={TaskListScreen}
            options={{ title: `Tareas de ${currentUser.firstName}` }}
          />
          <Stack.Screen
            name="TaskForm"
            component={TaskFormScreen}
            options={({ route }) => ({
              title: route.params?.task ? 'Editar tarea' : 'Nueva tarea',
            })}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registro' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={uiTheme}>
        <AuthProvider>
          <TasksProvider>
            <NavigationContainer theme={navTheme}>
              <RootNavigator />
            </NavigationContainer>
            <StatusBar style="dark" />
          </TasksProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}