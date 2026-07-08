import { AuthUser } from 'src/auth/interfaces/auth-user.interface';

declare global {
  namespace Express {
    interface Request {
      user: AuthUser;
    }
  }
}
