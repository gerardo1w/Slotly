export interface RequestUserRegister {
  name: string;
  email: string;
  password: string;
  role: 'client' | 'owner';
  complexData?: {
    name: string;
    address: string;
    district: string;
    phone: string;
  };
}
