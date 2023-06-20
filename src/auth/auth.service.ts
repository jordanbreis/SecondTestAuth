import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async CompPassword(password: string, accPassword: string) {
    const isMatch = await bcrypt.compare(password, accPassword);
    return isMatch;
  }

  async SingIn(email: string, password: string) {
    const account = await this.usersService.findOne(email);
    const accValid = this.CompPassword(password, account.password);

    if (accValid) {
      const payload = { sub: account._id, username: account.email };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new UnauthorizedException();
    }
  }
}
