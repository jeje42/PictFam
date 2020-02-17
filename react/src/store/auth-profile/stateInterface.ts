import { User } from '../../types/User';

export interface AuthState {
  token: string;
  isAuthenticated: boolean;
  loginHasFailed: boolean;
  expirationDate?: Date;
  userDetails?: User;
}
