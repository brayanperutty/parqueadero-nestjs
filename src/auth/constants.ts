import { SetMetadata } from "@nestjs/common";

export const jwtConstants = {
    secret: 'P1R2U3E4B5A6T7E8C9N0I1C2A3N4E5L6U7M8B9OC0M1P2A3N4Y',
};

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = 'ROLES';