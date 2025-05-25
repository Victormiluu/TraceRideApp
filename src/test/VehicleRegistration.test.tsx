import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Alert } from 'react-native';
import VehicleRegistration from '../screens/VehicleRegistrationScreen';

jest.spyOn(Alert, 'alert');

describe('VehicleRegistration', () => {
  it('exibe alerta quando campos estão vazios', () => {
    const component = renderer.create(<VehicleRegistration navigation={{} as any} />);
    const instance = component.root;
    
    const button = instance.findByProps({ children: 'Salvar Veículo' });
    act(() => button.props.onPress());
    
    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Preencha todos os campos!');
  });
});