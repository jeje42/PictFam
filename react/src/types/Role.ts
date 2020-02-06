export enum RoleName {
    ROLE_USER = "ROLE_USER",
    ROLE_ADMIN = "ROLE_ADMIN"
}

export interface Role {
    id: number,
    name: RoleName
}