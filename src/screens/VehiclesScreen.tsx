import React, { useEffect, useState } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text, ListRenderItem } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { RootStackParamList, Vehicle, LatLng } from '../../types';
import Layout from './Layout';

type VehiclesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Vehicles'>;

type Props = {
  navigation: VehiclesScreenNavigationProp;
};

const primaryColor = '#7CD4D9';

const defaultVehicle: Vehicle = {
  id: 'default-vehicle',
  plate: 'XYZ-1234',
  brand: 'Fiat',
  model: 'Mobi',
  color: 'Vermelho',
  year: '2023',
  chipCode: '123456',
  status: 'Em movimento',
  locations: [{
    latitude: -23.615263,
    longitude: -46.777475,
    timestamp: "2024-01-01T10:00:00"
  }, {
    latitude: -23.612618,
    longitude: -46.777817,
    timestamp: "2024-01-01T10:01:00"
  },
  {
    latitude: -23.611188,
    longitude: -46.775039,
    timestamp: "2024-01-01T10:02:00"
  },
  {
    latitude: -23.609932,
    longitude: -46.771728,
    timestamp: "2024-01-01T10:03:00"
  },
  {
    latitude: -23.609345,
    longitude: -46.770113,
    timestamp: "2024-01-01T10:04:00"
  },
  {
    latitude: -23.610348,
    longitude: -46.768376,
    timestamp: "2024-01-01T10:05:00"
  }],
  name: 'Fiat Mobi'
};

const VehiclesScreen = ({ navigation }: Props) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [updateTime, setUpdateTime] = useState(new Date());

  const loadVehicles = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@vehicles');
      const storedVehicles = jsonValue ? JSON.parse(jsonValue) : [];
      const hasDefault = storedVehicles.some((v: Vehicle) => v.id === defaultVehicle.id);
      const filteredVehicles = storedVehicles.filter((v: Vehicle) => v.id !== defaultVehicle.id);
      const mergedVehicles = [defaultVehicle, ...filteredVehicles];
      
      setVehicles(mergedVehicles);
      saveVehicles(mergedVehicles);
    } catch (e) {
      console.error('Erro ao carregar veículos:', e);
    }
  };

  const saveVehicles = async (data: Vehicle[]) => {
    try {
      await AsyncStorage.setItem('@vehicles', JSON.stringify(data));
    } catch (e) {
      console.error('Erro ao salvar veículos:', e);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setVehicles(current => {
        return current.map(vehicle => {
          if (vehicle.id === defaultVehicle.id) {
            const newLocation: LatLng = {
              latitude: vehicle.locations[0].latitude + (Math.random() * 0.01 - 0.005),
              longitude: vehicle.locations[0].longitude + (Math.random() * 0.01 - 0.005),
              timestamp: new Date().toISOString()
            };

            const lastUpdate = new Date(vehicle.locations[0].timestamp);
            const diffSeconds = (new Date().getTime() - lastUpdate.getTime()) / 1000;

            return {
              ...vehicle,
              locations: [newLocation, ...vehicle.locations.slice(0, 9)],
              status: diffSeconds > 30 ? 'Estacionado' : 'Em movimento'
            };
          }
          return vehicle;
        });
      });
      setUpdateTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

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
        <Text style={styles.statusText}>Status: {item.status}</Text>
        <Text style={styles.updateText}>
          Última atualização: {new Date(item.locations[0]?.timestamp).toLocaleTimeString()}
        </Text>
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
          extraData={updateTime}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('VehicleRegister')}
        >
          <Text style={styles.addButtonText}>Cadastrar Veículo</Text>
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
  statusText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  updateText: {
    fontSize: 12,
    color: '#999',
    marginTop: 3,
  },
});

export default VehiclesScreen;