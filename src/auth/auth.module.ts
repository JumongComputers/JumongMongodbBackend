import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,

    // ✅ IMPORTANT: set default strategy
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // ✅ safer config
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev_secret', // fallback prevents crash
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],

  // ✅ VERY IMPORTANT (used by other modules like Orders)
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
