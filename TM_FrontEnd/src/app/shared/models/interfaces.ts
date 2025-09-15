export interface IUser {
  id: string;
  email: string;
  password?: string;
  name: string;
  phone: string;
  role: 'admin' | 'client';
  isActivated: boolean;
  activationLink?: string;
}

export interface ICity {
  _id: string;
  name: string;
  dayTariff: number;
  nightTariff: number;
}

export interface IAbonent {
  _id: string;
  codeEDRPOU: string;
  cityId: ICity;
  userId: IUser; 
}

export interface ICall {
  _id: string;
  abonentId: IAbonent;
  phoneNumber: string;
  cityId: ICity;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  cost?: number;
}