import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /* =======================
     Login
  ======================= */
  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      access_token: this.jwtService.sign({
        sub: user._id.toString(), // ✅ FIXED
        role: user.role,
      }),
    };
  }

  /* =======================
     Registration
  ======================= */
  async register(dto: CreateUserDto) {
    const user = await this.usersService.register(dto);

    return {
      access_token: this.jwtService.sign({
        sub: user._id,
        role: user.role,
      }),
    };
  }
}
