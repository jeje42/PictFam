export interface AuthState {
    token: string,
    isAuthenticated: boolean,
    loginHasFailed: boolean,
    expirationDate?: Date,
    userName: string,
}