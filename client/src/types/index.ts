export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "user" | "admin";

export interface News {
  _id: string;
  title: string;
  content: string;
  image: string;
  description: string;
  publishDate: string;
  author: {
    _id: string;
    name: string;
  };
  views: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
