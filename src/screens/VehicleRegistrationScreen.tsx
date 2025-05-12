import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';

const primaryColor = '#7CD4D9';
const placeholderColor = '#999';

<<<<<<< HEAD
type Vehicle = {
=======
interface Vehicle {
>>>>>>> 1bef8cd0f0b870df485e811b643a5beaaab4388c
  id: string;
  plate: string;
  brand: string;
  model: string;
  color: string;
  year: string;
<<<<<<< HEAD
};
=======
}

>>>>>>> 1bef8cd0f0b870df485e811b643a5beaaab4388c

export default function VehicleRegistration() {
  const [plate, setPlate] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [color, setColor] = useState('');
  const [year, setYear] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const clearFields = () => {
    setPlate('');
    setBrand('');
    setModel('');
    setColor('');
    setYear('');
    setEditingId(null);
  };

  const handleSave = () => {
    if (!plate || !brand || !model || !color || !year) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    if (editingId) {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === editingId
            ? { ...v, plate, brand, model, color, year }
            : v
        )
      );
      Alert.alert('Atualizado', 'Veículo atualizado com sucesso!');
    } else {
      setVehicles((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          plate,
          brand,
          model,
          color,
          year,
        },
      ]);
      Alert.alert('Cadastrado', 'Veículo salvo com sucesso!');
    }

    clearFields();
  };

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

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {editingId ? 'Atualizar Veículo' : 'Salvar Veículo'}
        </Text>
      </TouchableOpacity>

      {editingId && (
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={clearFields}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

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
});
