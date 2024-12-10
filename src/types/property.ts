export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  area: number;
  location: {
    lat: number;
    lng: number;
  };
  plotNumber: string;
  district: string;
  status: 'available' | 'reserved' | 'sold';
  features: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}