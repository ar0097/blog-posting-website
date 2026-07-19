export interface User {
  _id: string;
  googleId: string;
  name: string;
  email: string;
  avatar: string;
  provider: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetUsersResponse {
  success: boolean;
  count: number;
  users: User[];
}
