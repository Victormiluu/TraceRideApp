import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
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
  latitude: number;
  longitude: number;
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
            setVehicle({ ...foundVehicle });
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
    }, 1000);

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
            latitude: vehicle.locations[0].latitude,
            longitude: vehicle.locations[0].longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          region={{
            latitude: isParked ? finalLocation.latitude : vehicle.locations[currentIndex].latitude,
            longitude: isParked ? finalLocation.longitude : vehicle.locations[currentIndex].longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Polyline
            coordinates={coordinates.map(loc => ({
              latitude: loc.latitude,
              longitude: loc.longitude
            }))}
            strokeColor="#7CD4D9"
            strokeWidth={3}
          />

          {isParked && vehicle.locations.map((location: any, index: number) => (
            <Marker
              key={index}
              coordinate={location}
              title={`Ponto ${index + 1}`}
              description={location.timestamp}
              pinColor="#7CD4D9"
            />
          ))}

          <Marker
            coordinate={isParked ? finalLocation : vehicle.locations[currentIndex]}
            title={isParked ? "Veículo Estacionado" : "Posição Atual"}
            description={isParked ? finalLocation.timestamp : vehicle.locations[currentIndex].timestamp}
          >
            <View style={styles.markerContainer}>
              {!isParked && <View style={styles.movingPulse} />}
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
            <>
              <Text style={styles.infoText}>
                Progresso: {currentIndex + 1}/{vehicle.locations.length}
              </Text>
              <Text style={styles.infoText}>
                Última atualização: {Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000)} segundos atrás
              </Text>
            </>
          )}

          <TouchableOpacity
            style={styles.card}
            // onPress={() => navigation.navigate('VehicleHistory', { vehicleId })}
          >
            <Text style={styles.cardText}>Últimos trajetos</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
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
  movingPulse: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#7CD4D950',
    borderWidth: 2,
    borderColor: '#7CD4D9',
    top: -5,
    left: 6,
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
