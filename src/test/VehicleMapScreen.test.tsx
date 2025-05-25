import React from 'react';
import renderer from 'react-test-renderer';
import VehicleMapScreen from '../screens/VehicleMapScreen';

jest.mock('react-native-maps', () => ({
  __esModule: true,
  default: 'View',
  Marker: 'Marker',
  Polyline: 'Polyline'
}));

describe('VehicleMapScreen', () => {
  it('exibe mensagem sem localizações', () => {
    const mockRoute = {
      key: 'test-key',
      name: 'VehicleMap',
      params: { vehicleId: '999' },
    };

    const component = renderer.create(
      <VehicleMapScreen route={mockRoute as any} />
    );

    const instance = component.root;
    
    expect(instance.findByProps({ children: 'Nenhuma localização registrada' })).toBeTruthy();
  });
});
