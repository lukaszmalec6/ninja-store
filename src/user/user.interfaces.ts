export enum UserStatus {
  active = 'active',
  banned = 'banned'
}

export enum UserRole {
  standard = 'standard',
  admin = 'admin'  
}

export interface IUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  // address: IUserAddress;
  status?: UserStatus;
  role?: UserRole;
}

export interface IUserAddress {
  country: string;
  city: string;
  street: string;
  houseNumber: number;
  postcode: string;
}
