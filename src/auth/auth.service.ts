import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // Hash the password before saving
    const passwordHash = await bcrypt.hash(dto.password, 10);
    
    // Create the user in the database
    const user = await this.usersService.create(dto.name, dto.email, passwordHash);
    
    return { message: `Account created for ${user.email}` };
  }

  async login(dto: LoginDto) {
    // Find the user by email
    const user = await this.usersService.findByEmail(dto.email);
    
    // Compare the provided password with the hashed password in the database
    const passwordOk = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordOk) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate the JWT token
    const payload = { sub: user.id, email: user.email };
    return { access_token: await this.jwtService.signAsync(payload) };
  }
}