import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Jwt from 'jsonwebtoken';
import { CreateAccountInput } from './dto/create-account-dto';
import { LoginInput } from './dto/login.dto';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput } from './dto/edit-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      const exists = await this.users.findOne({ email });

      if (exists) {
        return { ok: false, error: 'There is a user with that email already' };
      }

      await this.users.save(this.users.create({ email, password, role }));
      return { ok: true };
    } catch (e) {
      //make error
      return { ok: false, error: "Could'nt create account" };
    }
  }

  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    try {
      const user = await this.users.findOne({ email });

      const passwordCorrect = await user.checkPassword(password);

      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'wrong crendentials',
          token: null,
        };
      }

      if (!user) {
        return {
          ok: false,
          error: 'User not found',
          token: null,
        };
      }

      const token = this.jwtService.sign({ id: user.id });

      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        token: null,
        error,
      };
    }

    // find the user with email
    // check if the password is correct
    // make a jwt roken and give it back to user
  }

  async findById(id: number): Promise<User> {
    return await this.users.findOne({ id });
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<User> {
    const user = await this.users.findOne(userId);

    if (email) {
      user.email = email;
    }

    if (password) {
      user.password = password;
    }

    return this.users.save(user);
  }
}
