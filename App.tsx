import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, createTheme } from '@rneui/themed';
import { TasksProvider } from './src/context/TasksContext';
import TaskFormScreen from './src/screens/TaskFormScreen';
import TaskListScreen from './src/screens/TaskListScreen';
import { colors, fonts, radius, typography } from './src/theme/theme';
import type { RootStackParamList } from './src/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const uiTheme = createTheme({
  lightColors: { primary: colors.primary },
  components: {
    Button: {
      buttonStyle: { borderRadius: radius.md, paddingVertical: 15 },
      titleStyle: { ...typography.label, fontSize: 16, letterSpacing: 0.3 },
      disabledStyle: { backgroundColor: colors.primaryDisabled },
      disabledTitleStyle: { color: colors.surface },
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

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={uiTheme}>
        <TasksProvider>
          <NavigationContainer theme={navTheme}>
            <Stack.Navigator
              screenOptions={{
                headerStyle: { backgroundColor: colors.background },
                headerShadowVisible: false,
                headerTintColor: colors.primary,
                headerTitleStyle: { color: colors.text, fontFamily: fonts.serif, fontSize: 20, fontWeight: '600' },
              }}
            >
              <Stack.Screen name="TaskList" component={TaskListScreen} options={{ title: 'Mis tareas' }} />
              <Stack.Screen
                name="TaskForm"
                component={TaskFormScreen}
                options={({ route }) => ({
                  title: route.params?.task ? 'Editar tarea' : 'Nueva tarea',
                })}
              />
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="dark" />
        </TasksProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
