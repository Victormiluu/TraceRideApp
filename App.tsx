import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import LoginScreen from './src/screens/LoginScreean';
import VehiclesScreen from './src/screens/VehiclesScreen';
import VehicleMapScreen from './src/screens/VehicleMapScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import VehicleRegistrationScreen from './src/screens/VehicleRegistrationScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Vehicles"
          component={VehiclesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="VehicleMap"
          component={VehicleMapScreen}
          options={{ headerShown: false }}
        />
          <Stack.Screen
          name="VehicleRegister"
          component={VehicleRegistrationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
        
      />
      </Stack.Navigator>
    </NavigationContainer>
  );
}