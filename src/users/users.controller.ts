import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';
import { Roles } from 'src/roles/roles.decorator';
import { MongoIdPipe } from 'src/common/pipes/mongo-id.pipe';
// import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
// import type { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';
import { Role } from 'src/roles/enum';
import { AuthUser } from 'src/auth/interfaces/auth-user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: Request & { user: AuthUser }) {
    return this.usersService.findById(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  getUserById(@Param('id', MongoIdPipe) id: string) {
    return this.usersService.findById(id);
  }
}
