import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, Text, ListRenderItem } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Vehicle } from '../../types';

type VehiclesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Vehicles'>;

type Props = {
  navigation: VehiclesScreenNavigationProp;
};

const primaryColor = '#7CD4D9';
export const mockVehicles: Vehicle[] = [
    { 
      id: '1', 
      name: 'Fiat Argo', 
      model: 'Car',
      plate: 'ABC-1234',
      status: 'Em movimento',
      locations: (() => {
        const now = Date.now();
        return [
          { 
            latitude: -23.561399, 
            longitude: -46.656505, 
            timestamp: new Date(now - 35000).toLocaleTimeString() // 35 segundos atrás
          },
          { 
            latitude: -23.561200, 
            longitude: -46.655900, 
            timestamp: new Date(now - 30000).toLocaleTimeString() // 30 segundos
          },
          { 
            latitude: -23.560800, 
            longitude: -46.654700, 
            timestamp: new Date(now - 25000).toLocaleTimeString() // 25 segundos
          },
          { 
            latitude: -23.558621, 
            longitude: -46.653812, 
            timestamp: new Date(now - 20000).toLocaleTimeString() // 20 segundos
          },
          { 
            latitude: -23.557300, 
            longitude: -46.652900, 
            timestamp: new Date(now - 15000).toLocaleTimeString() // 15 segundos
          },
          { 
            latitude: -23.545847, 
            longitude: -46.643889, 
            timestamp: new Date(now - 10000).toLocaleTimeString() // 10 segundos
          },
          { 
            latitude: -23.544460, 
            longitude: -46.638860, 
            timestamp: new Date(now - 5000).toLocaleTimeString() // 5 segundos
          },
          { 
            latitude: -23.550516, 
            longitude: -46.633324, 
            timestamp: new Date(now).toLocaleTimeString() // Agora
          }
        ];
      })()
    },
    { 
      id: '2', 
      name: 'Honda CB 500', 
      model: 'Motorcycle',
      plate: 'MOT-9876',
      status: 'Estacionado',
      locations: [
        { 
          latitude: -23.5605, 
          longitude: -46.6433, 
          timestamp: new Date(Date.now() - 60000).toLocaleTimeString() // 1 minuto atrás
        },
        { 
          latitude: -23.5615, 
          longitude: -46.6443, 
          timestamp: new Date(Date.now() - 30000).toLocaleTimeString() // 30 segundos atrás
        }
      ]
    },
  ];

const VehiclesScreen = ({ navigation }: Props) => {
  const renderItem: ListRenderItem<Vehicle> = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardInfo}>
        <Text style={styles.vehicleName}>{item.name}</Text>
        <Text style={styles.vehicleModel}>{item.model}</Text>
      </View>
      <TouchableOpacity 
        style={styles.locationButton}
        onPress={() => navigation.navigate('VehicleMap', { vehicleId: item.id })}
      >
        <Icon name="map-marker" size={24} color={primaryColor} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mockVehicles}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
      
      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Register Vehicle</Text>
      </TouchableOpacity>
    </View>
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
    locationButton: {
      padding: 10,
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