import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreean';

// Mock de navegação
const Stack = createStackNavigator();
const MockNavigator = ({ component }: { component: React.ComponentType<any> }) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Login" component={component} />
      <Stack.Screen name="Vehicles" component={() => null} />
      <Stack.Screen name="Register" component={() => null} />
    </Stack.Navigator>
  </NavigationContainer>
);

describe('LoginScreen', () => {
  it('renderiza título e inputs corretamente', () => {
    const component = renderer.create(<MockNavigator component={LoginScreen} />);
    const instance = component.root;
    
    expect(instance.findByProps({ children: 'TraceRide' })).toBeTruthy();
    expect(instance.findByProps({ placeholder: 'Username or Email' })).toBeTruthy();
    expect(instance.findByProps({ placeholder: 'Password' })).toBeTruthy();
  });

  it('navega para Vehicles ao pressionar login', () => {
    const component = renderer.create(<MockNavigator component={LoginScreen} />);
    const instance = component.root;
    
    const button = instance.findByProps({ children: 'Login' });
    act(() => button.props.onPress());
    
    // Verifica navegação pelo nome da tela atual
    const header = instance.findByProps({ testID: 'navigation-header' });
    expect(header.props.children).toContain('Vehicles');
  });
});