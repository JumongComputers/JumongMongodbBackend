import { Role } from 'src/roles/enum';

export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
}
