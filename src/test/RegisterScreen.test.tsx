import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Alert } from 'react-native';
import RegisterScreen from '../screens/RegisterScreen';

jest.spyOn(Alert, 'alert');

describe('RegisterScreen', () => {
  it('exibe erros quando campos estão vazios', () => {
    const component = renderer.create(<RegisterScreen navigation={{} as any} />);
    const instance = component.root;
    
    const button = instance.findByProps({ children: 'Register' });
    act(() => button.props.onPress());
    
    const errorInputs = instance.findAllByProps({ style: { borderColor: 'red' } });
    expect(errorInputs.length).toBe(4);
  });

  it('valida confirmação de senha', () => {
    const component = renderer.create(<RegisterScreen navigation={{} as any} />);
    const instance = component.root;
    
    const passwordInput = instance.findByProps({ placeholder: 'Password' });
    const confirmInput = instance.findByProps({ placeholder: 'Confirm Password' });
    
    act(() => {
      passwordInput.props.onChangeText('123');
      confirmInput.props.onChangeText('456');
    });
    
    const button = instance.findByProps({ children: 'Register' });
    act(() => button.props.onPress());
    
    expect(Alert.alert).toHaveBeenCalled();
  });
});