import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const primaryColor = '#7CD4D9';

const LoginScreen = ({ navigation }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TraceRide</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username or Email"
        placeholderTextColor="#999"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
      />
      
      <TouchableOpacity 
        style={styles.loginButton}
        onPress={() => navigation.navigate('Vehicles')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
  <Text style={styles.createAccountText}>Create an account</Text>
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
    loginButton: {
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
    createAccountText: {
      color: primaryColor,
      textAlign: 'center',
      fontSize: 16,
      textDecorationLine: 'underline',
    },
  });
  
  export default LoginScreen;