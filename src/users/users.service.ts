import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';

import { User, UserDocument } from './schema/schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    // private readonly jwtService: JwtService,
  ) {}

  /* =======================
     Helpers (PRIVATE)
  ======================= */

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async validatePassword(
    plain: string,
    hashed: string,
  ): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
  }

  /* =======================
     Core User Queries
  ======================= */

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async updateRefreshToken(userId: string, hashedToken: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: hashedToken,
    });
  }

  async removeRefreshToken(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: null,
    });
  }

  /* =======================
     Registration
  ======================= */

  async register(dto: CreateUserDto): Promise<UserDocument> {
    const existingUser = await this.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await this.hashPassword(dto.password);

    const user = await this.userModel.create({
      ...dto,
      password: passwordHash,
    });

    return user;
  }
}
