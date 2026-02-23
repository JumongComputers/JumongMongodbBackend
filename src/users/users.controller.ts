import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get currently authenticated user
   * (useful for frontend: /me)
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Param('userId') userId: string) {
    return this.usersService.findById(userId);
  }

  /**
   * Get user by id (admin / internal use later)
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
