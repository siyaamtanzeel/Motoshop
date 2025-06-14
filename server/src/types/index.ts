// Centralized types for user roles
export type UserRole = 'admin' | 'buyer';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBike {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  seller: string; // user id (always admin)
  specifications: Record<string, string | number | boolean>;
  category: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder {
  _id: string;
  buyer: string; // user id
  bike: string; // bike id
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  paymentId?: string;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}
