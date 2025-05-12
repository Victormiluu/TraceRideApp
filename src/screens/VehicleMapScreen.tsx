import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RootStackParamList } from '../../types';
import { mockVehicles } from './VehiclesScreen';

type VehicleMapScreenRouteProp = RouteProp<RootStackParamList, 'VehicleMap'>;

type Props = {
  route: VehicleMapScreenRouteProp;
};

const VehicleMapScreen = ({ route }: Props) => {
  const { vehicleId } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [vehicle, setVehicle] = useState(() => {
    const v = mockVehicles.find(v => v.id === vehicleId);
    return v ? {...v} : null;
  });

  // Efeito para atualização automática do status
  useEffect(() => {
    if (!vehicle || vehicle.status === 'Estacionado') return;

    const inactivityTimer = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - lastUpdate.getTime();
      
      if (diff > 30000) { // 30 segundos
        setVehicle(prev => {
          if (!prev) return null;
          return {...prev, status: 'Estacionado'};
        });
        clearInterval(inactivityTimer);
      }
    }, 1000);

    return () => clearInterval(inactivityTimer);
  }, [lastUpdate, vehicle?.status]);

  // Efeito para animação do movimento
  useEffect(() => {
    if (!vehicle || vehicle.status === 'Estacionado' || !vehicle.locations.length) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev < vehicle.locations.length - 1) {
          setLastUpdate(new Date()); // Atualiza o timestamp
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [vehicle?.status, vehicle?.locations.length]);

  if (!vehicle || !vehicle.locations.length) {
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
    <View style={styles.container}>
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

        {isParked && vehicle.locations.map((location, index) => (
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
            <Icon 
              name="car" 
              size={15} 
              color={isParked ? "#4CAF50" : "#7CD4D9"} 
            />
            {!isParked && <View style={styles.movingPulse} />}
          </View>
        </Marker>
      </MapView>

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>{vehicle.name}</Text>
        <Text style={styles.infoText}>Placa: {vehicle.plate}</Text>
        <Text style={[styles.infoText, { color: isParked ? "#4CAF50" : "#7CD4D9" }]}>
          Status: {vehicle.status}
        </Text>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: 'white',
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
});

export default VehicleMapScreen;