import React from 'react';
import renderer from 'react-test-renderer';
import VehiclesScreen from '../screens/VehiclesScreen';

describe('VehiclesScreen', () => {
  it('renderiza lista de veículos', () => {
    const component = renderer.create(<VehiclesScreen navigation={{} as any} />);
    const instance = component.root;
    
    expect(instance.findByProps({ children: 'Fiat Argo' })).toBeTruthy();
    expect(instance.findByProps({ children: 'Honda CB 500' })).toBeTruthy();
  });
});