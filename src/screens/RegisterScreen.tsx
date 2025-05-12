import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

type Props = {
  navigation: RegisterScreenNavigationProp;
};

const primaryColor = '#7CD4D9';

const RegisterScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({
    email: false,
    cpf: false,
    password: false,
    confirmPassword: false,
  });

  const handleRegister = () => {
    const newErrors = {
      email: !email,
      cpf: !cpf,
      password: !password,
      confirmPassword: !confirmPassword || password !== confirmPassword,
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    console.log('Account created!');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={[styles.input, errors.cpf && styles.inputError]}
        placeholder="CPF"
        placeholderTextColor="#999"
        value={cpf}
        onChangeText={setCpf}
        keyboardType="numeric"
      />

      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={[styles.input, errors.confirmPassword && styles.inputError]}
        placeholder="Confirm Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.loginLink}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: primaryColor,
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  inputError: {
    borderColor: 'red',
  },
  registerButton: {
    height: 50,
    backgroundColor: primaryColor,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    color: primaryColor,
    textAlign: 'center',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
