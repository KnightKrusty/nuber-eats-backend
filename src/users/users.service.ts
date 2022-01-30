import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dto/create-account-dto';
import { LoginInput } from './dto/login.dto';
import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput, EditProfileOutput } from './dto/edit-profile.dto';
import { Verification } from './entities/verification.entity';
import { UserProfileOutput } from './dto/user-profile.dto';
import { VerifyEmailOutput } from './dto/verify-email.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verificaitions: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
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

      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );
      const verificaition = await this.verificaitions.save(
        this.verificaitions.create({
          user,
        }),
      );

      this.mailService.sendVerificationEmail(user.email, verificaition.code);

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
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password', 'verified'] },
      );

      if (!user) {
        return {
          ok: false,
          error: 'User not found',
          token: null,
        };
      }

      if (!user.verified) {
        return {
          ok: false,
          error: 'Account is not verified',
          token: null,
        };
      }

      const passwordCorrect = await user.checkPassword(password);

      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'wrong crendentials',
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

  async findById(id: number): Promise<UserProfileOutput> {
    try {
      const user = await this.users.findOne({ id });

      return {
        ok: true,
        user,
      };
    } catch (e) {
      return { ok: false, error: 'User not found' };
    }
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      const user = await this.users.findOne(userId);

      if (email) {
        user.email = email;
        user.verified = false;
        const verification = await this.verificaitions.save(
          this.verificaitions.create({ user }),
        );

        this.mailService.sendVerificationEmail(user.email, verification.code);
      }

      if (password) {
        user.password = password;
      }

      this.users.save(user);

      return {
        ok: true,
      };
    } catch (error) {
      return { ok: false, error: 'Could Not update profile' };
    }
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verificaitions.findOne(
        { code },
        { relations: ['user'] },
      );

      if (verification) {
        verification.user.verified = true;
        await this.users.save(verification.user);
        await this.verificaitions.delete(verification.id);
        return { ok: true };
      }

      return { ok: false, error: 'Verification Not found' };
    } catch (e) {
      return { ok: false, error: 'Could not verify email' };
    }
  }
}
