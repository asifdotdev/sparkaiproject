import { User, Role, ProviderProfile } from '../db/models';
import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, TokenPayload } from '../utils/jwt';
import { ApiError } from '../utils/apiError';
import { ROLE_IDS } from '@sparkai/shared';

export class AuthService {
  static async register(data: { name: string; email: string; phone?: string; password: string; role: string }) {
    const existingUser = await User.scope('withPassword').findOne({ where: { email: data.email } });
    if (existingUser) {
      throw ApiError.conflict('Email already registered');
    }

    const roleId = data.role === 'provider' ? ROLE_IDS.PROVIDER : ROLE_IDS.USER;
    const hashedPassword = await hashPassword(data.password);

    const user = await User.scope('withPassword').create({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      password: hashedPassword,
      roleId,
      isActive: true,
    });

    // Create provider profile if registering as provider
    if (data.role === 'provider') {
      await ProviderProfile.create({ userId: user.id });
    }

    const role = await Role.findByPk(roleId);
    const tokenPayload: TokenPayload = {
      userId: user.id,
      roleId: user.roleId,
      role: role!.name,
    };

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: role!.name,
      },
      accessToken: generateAccessToken(tokenPayload),
      refreshToken: generateRefreshToken(tokenPayload),
    };
  }

  static async login(email: string, password: string) {
    const user = await User.scope('withPassword').findOne({
      where: { email },
      include: [{ model: Role, as: 'role' }],
    });

    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated');
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const role = (user as any).role as Role;
    const tokenPayload: TokenPayload = {
      userId: user.id,
      roleId: user.roleId,
      role: role.name,
    };

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: role.name,
      },
      accessToken: generateAccessToken(tokenPayload),
      refreshToken: generateRefreshToken(tokenPayload),
    };
  }

  static async refreshToken(token: string) {
    const payload = verifyRefreshToken(token);
    const user = await User.findByPk(payload.userId, {
      include: [{ model: Role, as: 'role' }],
    });

    if (!user || !user.isActive) {
      throw ApiError.unauthorized('Invalid refresh token');
    }

    const role = (user as any).role as Role;
    const tokenPayload: TokenPayload = {
      userId: user.id,
      roleId: user.roleId,
      role: role.name,
    };

    return {
      accessToken: generateAccessToken(tokenPayload),
      refreshToken: generateRefreshToken(tokenPayload),
    };
  }

  static async getMe(userId: number) {
    const user = await User.findByPk(userId, {
      include: [
        { model: Role, as: 'role' },
        { model: ProviderProfile, as: 'providerProfile' },
      ],
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  }
}
