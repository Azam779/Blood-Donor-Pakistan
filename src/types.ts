export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface DonorRecord {
  id: string;
  uid: string;
  name: string;
  phone: string;
  age: number;
  bloodGroup: BloodGroup;
  province: string;
  district: string;
  city: string;
  area: string;
  address?: string;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DistrictData {
  name: string;
  cities: string[];
}

export type ScreenType = 'splash' | 'home' | 'donate' | 'success' | 'search' | 'profile' | 'login' | 'otp';

export interface ProjectFile {
  path: string;
  name: string;
  type: 'java' | 'xml' | 'gradle' | 'json' | 'rules' | 'pro' | 'properties';
  content: string;
}
