import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../user/user.repository';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { UpdateProfileDto } from './dtos/update-profile.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { UserOutputDto } from '../user/dtos/user-output.dto';
import { EmailVerificationService } from './email-verification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  async register(dto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const user = await this.userRepository.create({
      ...dto,
      password: hashedPassword,
      roles: dto.roles || ['User'], // Default role
    });

    // Generate tokens
    const tokens = await this.generateTokens(user._id.toString(), user.roles);

    // Save refresh token for blacklist tracking
    await this.userRepository.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    // Send email verification (async, don't block registration)
    this.emailVerificationService.sendVerificationEmail(user._id.toString()).catch((error) => {
      // Log error but don't fail registration
      console.error('Failed to send verification email:', error);
    });

    return {
      ...tokens,
      user: this.mapToOutputDto(user),
    };
  }

  async login(dto: LoginDto) {
    // Find user by email
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is locked
    if (user.accountLockedUntil && user.accountLockedUntil > new Date()) {
      const lockTimeRemaining = Math.ceil((user.accountLockedUntil.getTime() - Date.now()) / 60000);
      throw new UnauthorizedException(
        `Account is locked. Please try again in ${lockTimeRemaining} minute(s).`,
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      // Increment failed login attempts
      const failedAttempts = (user.failedLoginAttempts || 0) + 1;
      const updateData: any = { failedLoginAttempts: failedAttempts };

      // Lock account after 5 failed attempts
      if (failedAttempts >= 5) {
        updateData.accountLockedUntil = new Date(Date.now() + 900000); // 15 minutes
      }

      await this.userRepository.update(user._id.toString(), updateData);

      if (failedAttempts >= 5) {
        throw new UnauthorizedException(
          'Account locked due to multiple failed login attempts. Please try again in 15 minutes.',
        );
      }

      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset failed login attempts on successful login
    if (user.failedLoginAttempts > 0) {
      await this.userRepository.update(user._id.toString(), {
        failedLoginAttempts: 0,
        accountLockedUntil: null,
      });
    }

    // Generate tokens
    const tokens = await this.generateTokens(user._id.toString(), user.roles);

    // Save refresh token for blacklist tracking
    await this.userRepository.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    return {
      ...tokens,
      user: this.mapToOutputDto(user),
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      // Verify refresh token with separate secret
      const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
      if (!refreshSecret) {
        throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
      }
      const payload = this.jwtService.verify(refreshToken, {
        secret: refreshSecret,
      });

      // Check if token is blacklisted
      const user = await this.userRepository.findById(payload.sub);
      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new tokens
      // Token rotation is enabled
      const tokens = await this.generateTokens(payload.sub, payload.roles);

      // Update refresh token in database
      // This enables token family rotation tracking
      await this.userRepository.updateRefreshToken(payload.sub, tokens.refreshToken);

      return tokens;
    } catch (error: any) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async getProfile(userId: string): Promise<UserOutputDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.mapToOutputDto(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<UserOutputDto> {
    // Find user (with password field for verification)
    const user = await this.userRepository.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if email is being changed and already exists
    if (dto.email && dto.email !== user.email) {
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }

    // Update user fields
    const updateData: any = {
      firstName: dto.firstName,
    };

    // Only include lastName if provided (allow empty string to clear)
    if (dto.lastName !== undefined) {
      updateData.lastName = dto.lastName;
    }

    // Only update email if provided and different
    if (dto.email && dto.email !== user.email) {
      updateData.email = dto.email;
    }

    // Update user in database
    const updatedUser = await this.userRepository.update(userId, updateData);
    if (!updatedUser) {
      throw new NotFoundException('Failed to update user');
    }

    return this.mapToOutputDto(updatedUser);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<{ message: string }> {
    // Find user with password field
    const user = await this.userRepository.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Check that new password is different from current
    const isSamePassword = await bcrypt.compare(dto.newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    // Update password in database
    await this.userRepository.update(userId, { password: hashedPassword });

    // Optionally: Invalidate all refresh tokens for security
    // await this.userRepository.updateRefreshToken(userId, null);

    return { message: 'Password changed successfully' };
  }

  async logout(userId: string, _refreshToken: string, _accessToken?: string) {
    // Invalidate refresh token by clearing it from database
    await this.userRepository.updateRefreshToken(userId, null);

    // SECURITY WARNING: Access tokens remain valid until expiry
    // Enable caching feature for immediate token revocation
  }

  private async generateTokens(userId: string, roles: string[]) {
    const payload = { sub: userId, roles };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: (this.configService.get<string>('JWT_ACCESS_EXPIRY') || '15m') as any,
    });

    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    if (!refreshSecret) {
      throw new Error('JWT_REFRESH_SECRET is not defined in environment variables');
    }
    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: (this.configService.get<string>('JWT_REFRESH_EXPIRY') || '30d') as any,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  private mapToOutputDto(user: any): UserOutputDto {
    return {
      id: (user._id as any).toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
