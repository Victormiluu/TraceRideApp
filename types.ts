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
    timestamp: string;
  }
  
  export interface Vehicle {
    id: string;
    plate: string;
    brand: string;
    model: string;
    color: string;
    year: string;
    chipCode: string;
    status: string;
    locations: LatLng[];
    name: string;
  }
