// Simple map service stub
export interface MapLocation {
  lat: number;
  lng: number;
  address: string;
}

export async function geocodeAddress(address: string): Promise<MapLocation | null> {
  // Stub implementation
  return {
    lat: 0,
    lng: 0,
    address
  };
}
