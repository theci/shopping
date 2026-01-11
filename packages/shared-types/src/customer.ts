export interface Customer {
  id: number;
  email: string;
  name: string;
  phoneNumber?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomerDto {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
  address?: string;
}

export interface UpdateCustomerDto {
  name?: string;
  phoneNumber?: string;
  address?: string;
}
