// src/auth/interfaces/auth-user.interface.ts
import { Role } from 'src/roles/enum';

export interface AuthUser {
  userId: string;
  email: string;
  role: Role;
}
