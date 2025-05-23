import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../types';

type VehicleRegisterScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'VehicleRegister'
>;

type Props = {
  navigation: VehicleRegisterScreenNavigationProp;
};

const primaryColor = '#7CD4D9';
const placeholderColor = '#999';

type Vehicle = {
  id: string;
  plate: string;
  brand: string;
  model: string;
  color: string;
  year: string;
  chipCode: string;
};

const VehicleRegistration = ({ navigation }: Props) => {
  const [plate, setPlate] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [year, setYear] = useState('');
  const [chipCode, setChipCode] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const clearFields = () => {
    setPlate('');
    setBrand('');
    setModel('');
    setColor('');
    setYear('');
    setChipCode('');
    setEditingId(null);
  };

  const saveVehiclesToStorage = async (data: Vehicle[]) => {
    try {
      await AsyncStorage.setItem('@vehicles', JSON.stringify(data));
    } catch (error) {
      console.error('Erro ao salvar no AsyncStorage:', error);
    }
  };

  const loadVehiclesFromStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem('@vehicles');
      if (stored) {
        setVehicles(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar do AsyncStorage:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehiclesFromStorage();
  }, []);

  const handleSave = () => {
    if (!plate || !brand || !model || !color || !year || !chipCode) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const currentYear = new Date().getFullYear();
    const parsedYear = parseInt(year);
    if (isNaN(parsedYear) || parsedYear < 1900 || parsedYear > currentYear) {
      Alert.alert('Erro', 'Ano inválido.');
      return;
    }

    if (!editingId && vehicles.some((v) => v.plate === plate)) {
      Alert.alert('Erro', 'Já existe um veículo com essa placa.');
      return;
    }

    if (editingId) {
      const updatedVehicles = vehicles.map((v) =>
        v.id === editingId
          ? { ...v, plate, brand, model, color, year, chipCode }
          : v
      );
      setVehicles(updatedVehicles);
      saveVehiclesToStorage(updatedVehicles);
      Alert.alert('Atualizado', 'Veículo atualizado com sucesso!');
    } else {
      const newVehicle = {
        id: Date.now().toString(),
        plate,
        brand,
        model,
        color,
        year,
        chipCode,
      };
      const updatedVehicles = [...vehicles, newVehicle];
      setVehicles(updatedVehicles);
      saveVehiclesToStorage(updatedVehicles);
      Alert.alert('Cadastrado', 'Veículo salvo com sucesso!');
    }

    clearFields();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={primaryColor} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro de Veículos</Text>

      <TextInput
        style={styles.input}
        placeholder="Placa"
        placeholderTextColor={placeholderColor}
        value={plate}
        onChangeText={setPlate}
      />
      <TextInput
        style={styles.input}
        placeholder="Marca"
        placeholderTextColor={placeholderColor}
        value={brand}
        onChangeText={setBrand}
      />
      <TextInput
        style={styles.input}
        placeholder="Modelo"
        placeholderTextColor={placeholderColor}
        value={model}
        onChangeText={setModel}
      />
      <TextInput
        style={styles.input}
        placeholder="Cor"
        placeholderTextColor={placeholderColor}
        value={color}
        onChangeText={setColor}
      />
      <TextInput
        style={styles.input}
        placeholder="Ano"
        placeholderTextColor={placeholderColor}
        keyboardType="numeric"
        value={year}
        onChangeText={setYear}
      />
      <TextInput
        style={styles.input}
        placeholder="ChipCode"
        placeholderTextColor={placeholderColor}
        keyboardType="numeric"
        value={chipCode}
        onChangeText={setChipCode}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {editingId ? 'Atualizar Veículo' : 'Salvar Veículo'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.cancelButton]}
        onPress={clearFields}
      >
        <Text style={styles.buttonText}>Limpar Campos</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: primaryColor,
  },
  input: {
    borderWidth: 1,
    borderColor: primaryColor,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: primaryColor,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default VehicleRegistration;
