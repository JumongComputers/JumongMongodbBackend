import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

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

    const payload = {
      sub: user._id.toString(),
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    // 🔐 Store hashed refresh token
    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(
      user._id.toString(),
      hashedRefresh,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  /* =======================
     Registration
  ======================= */
  async register(dto: CreateUserDto) {
    const user = await this.usersService.register(dto);

    const payload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    const hashedRefresh = await bcrypt.hash(refreshToken, 10);
    await this.usersService.updateRefreshToken(
      user._id.toString(),
      hashedRefresh,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  /* =======================
   Refresh Tokens (With Rotation)
======================= */
  async refreshTokens(refreshToken: string) {
    try {
      // 1️⃣ Verify refresh token signature
      const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const user = await this.usersService.findById(payload.sub);

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Access denied');
      }

      // 2️⃣ Compare stored hashed refresh token
      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);

      if (!isMatch) {
        throw new UnauthorizedException('Access denied');
      }

      // 3️⃣ Generate new payload
      const newPayload = {
        sub: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      // 4️⃣ Generate NEW access token
      const newAccessToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '15m',
      });

      // 5️⃣ Generate NEW refresh token (rotation)
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      });

      // 6️⃣ Hash and replace old refresh token
      const hashedRefresh = await bcrypt.hash(newRefreshToken, 10);
      await this.usersService.updateRefreshToken(
        user._id.toString(),
        hashedRefresh,
      );

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
