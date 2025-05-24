import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { RouteProp, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootStackParamList } from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Layout from './Layout';
import { StackNavigationProp } from '@react-navigation/stack';

type VehicleMapScreenRouteProp = RouteProp<RootStackParamList, 'VehicleMap'>;
type NavigationProp = StackNavigationProp<RootStackParamList>;

type Props = {
  route: VehicleMapScreenRouteProp;
};

type Location = {
  latitude: number | string;
  longitude: number | string;
  timestamp: string;
};

type Vehicle = {
  id: string;
  name: string;
  plate: string;
  status: string;
  locations?: Location[];
};

const VehicleMapScreen = ({ route }: Props) => {
  const navigation = useNavigation<NavigationProp>();
  const { vehicleId } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);



  useEffect(() => {
    const loadVehicle = async () => {
      try {
        const storedVehicles = await AsyncStorage.getItem('@vehicles');
        if (storedVehicles) {
          const vehicles = JSON.parse(storedVehicles);
          const foundVehicle = vehicles.find((v: any) => v.id === vehicleId);
          if (foundVehicle) {
            setVehicle({
              ...foundVehicle,
              status: foundVehicle.status || 'Estacionado',
              locations: foundVehicle.locations || [],
            });
          } else {
            setVehicle(null);
          }
        } else {
          setVehicle(null);
        }
      } catch (error) {
        console.error('Erro ao carregar veículo do AsyncStorage:', error);
        setVehicle(null);
      }
    };

    loadVehicle();
  }, [vehicleId]);

  useEffect(() => {
    if (!vehicle || vehicle.status === 'Estacionado') return;

    const inactivityTimer = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - lastUpdate.getTime();

      if (diff > 30000) {
        setVehicle(prev => {
          if (!prev) return null;
          return { ...prev, status: 'Estacionado' };
        });
        clearInterval(inactivityTimer);
      }
    }, 1000);

    return () => clearInterval(inactivityTimer);
  }, [lastUpdate, vehicle?.status]);

  useEffect(() => {
    if (!vehicle || vehicle.status === 'Estacionado' || !vehicle.locations || vehicle.locations.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (vehicle.locations && prev < vehicle.locations.length - 1) {
          setLastUpdate(new Date());
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [vehicle?.status, vehicle?.locations?.length]);

  if (!vehicle || !vehicle.locations || vehicle.locations.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Nenhuma localização registrada</Text>
      </View>
    );
  }

  const isParked = vehicle.status === 'Estacionado';
  const finalLocation = vehicle.locations[vehicle.locations.length - 1];
  const coordinates = isParked
    ? vehicle.locations
    : vehicle.locations.slice(0, currentIndex + 1);

  const safeParse = (val: any): number => {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  };
  const handleDeleteVehicle = async () => {
    try {
      const storedVehicles = await AsyncStorage.getItem('@vehicles');
      if (storedVehicles) {
        const vehicles = JSON.parse(storedVehicles);
        const updatedVehicles = vehicles.filter((v: any) => v.id !== vehicleId);
        await AsyncStorage.setItem('@vehicles', JSON.stringify(updatedVehicles));
        navigation.goBack();
      }
    } catch (error) {
      console.error('Erro ao excluir veículo:', error);
    }
  };
  

  return (
    <Layout>
      <View style={styles.container}>
        <View style={styles.statusHeader}>
          <Text style={[styles.statusText, { color: isParked ? "#4CAF50" : "#7CD4D9" }]}>
            Status: {vehicle.status}
          </Text>
        </View>

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: safeParse(vehicle.locations[0].latitude),
            longitude: safeParse(vehicle.locations[0].longitude),
            latitudeDelta: 0.0100,
            longitudeDelta: 0.0100,
          }}
          region={{
            latitude: isParked
              ? safeParse(finalLocation.latitude)
              : safeParse(vehicle.locations[currentIndex].latitude),
            longitude: isParked
              ? safeParse(finalLocation.longitude)
              : safeParse(vehicle.locations[currentIndex].longitude),
            latitudeDelta: 0.0100,
            longitudeDelta: 0.0100,
          }}
        >
          <Polyline
            coordinates={coordinates.map(loc => ({
              latitude: safeParse(loc.latitude),
              longitude: safeParse(loc.longitude),
            }))}
            strokeColor="#7CD4D9"
            strokeWidth={3}
          />

          {isParked && vehicle.locations.map((location, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: safeParse(location.latitude),
                longitude: safeParse(location.longitude),
              }}
              title={`Ponto ${index + 1}`}
              description={location.timestamp}
              pinColor="#7CD4D9"
            />
          ))}

          <Marker
            coordinate={{
              latitude: isParked
                ? safeParse(finalLocation.latitude)
                : safeParse(vehicle.locations[currentIndex].latitude),
              longitude: isParked
                ? safeParse(finalLocation.longitude)
                : safeParse(vehicle.locations[currentIndex].longitude),
            }}
            title={isParked ? "Veículo Estacionado" : "Posição Atual"}
            description={isParked ? finalLocation.timestamp : vehicle.locations[currentIndex].timestamp}
          >
            <View style={styles.markerContainer}>
              <Icon
                name="car"
                size={15}
                color={isParked ? "#4CAF50" : "#7CD4D9"}
              />
            </View>
          </Marker>
        </MapView>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>{vehicle.name}</Text>
          <Text style={styles.infoText}>Placa: {vehicle.plate}</Text>

          {!isParked && (
            <Text style={styles.infoText}>
              Última atualização: {Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000)} segundos atrás
            </Text>
          )}

          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardText}>Últimos trajetos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() =>
              Alert.alert(
                'Excluir veículo',
                'Tem certeza que deseja excluir este veículo?',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Excluir', onPress: handleDeleteVehicle, style: 'destructive' },
                ]
              )
            }
          >
            <Icon name="trash" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  deleteButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  statusHeader: {
    padding: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  map: {
    height: '60%',
  },
  infoContainer: {
    padding: 20,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  markerContainer: {
    alignItems: 'center',
  },
  card: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#7CD4D9',
    width: '100%',
    alignItems: 'center',
  },
  cardText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default VehicleMapScreen;
