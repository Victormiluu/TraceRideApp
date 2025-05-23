import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text, ListRenderItem } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootStackParamList, Vehicle } from '../../types';
import Layout from './Layout';

type VehiclesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Vehicles'>;

type Props = {
  navigation: VehiclesScreenNavigationProp;
};

const primaryColor = '#7CD4D9';

const VehiclesScreen = ({ navigation }: Props) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const loadVehicles = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@vehicles'); 
      if (jsonValue != null) {
        const storedVehicles = JSON.parse(jsonValue);
        setVehicles(storedVehicles);
      } else {
        setVehicles([]);
      }
    } catch (e) {
      console.error('Erro ao carregar veículos do AsyncStorage:', e);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadVehicles);
    return unsubscribe;
  }, [navigation]);

  const renderItem: ListRenderItem<Vehicle> = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('VehicleMap', { vehicleId: item.id })}
    >
      <View style={styles.cardInfo}>
        <Text style={styles.vehicleName}>{item.name}</Text>
        <Text style={styles.vehicleModel}>{item.model}</Text>
      </View>
      <Icon name="map-marker" size={24} color={primaryColor} />
    </TouchableOpacity>
  );

  return (
    <Layout>
      <View style={styles.container}>
        <FlatList
          data={vehicles}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('VehicleRegister')}
        >
          <Text style={styles.addButtonText}>Register Vehicle</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  list: {
    padding: 15,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
  },
  cardInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  vehicleModel: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: primaryColor,
    borderRadius: 8,
    padding: 15,
    margin: 15,
    alignItems: 'center',

  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VehiclesScreen;
