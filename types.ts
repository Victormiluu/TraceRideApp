export type RootStackParamList = {
    Login: undefined;
    Vehicles: undefined;
    VehicleMap: { vehicleId: string };
    VehicleRegister: undefined
    Register: undefined;
  };
  
  export interface LatLng {
    latitude: number;
    longitude: number;
    timestamp?: string;
  }
  
  export interface Vehicle {
    id: string;
    name: string;
    model: 'Car' | 'Motorcycle';
    plate?: string;
    locations: LatLng[];
    status?: string;
  }
