import { User, Role } from '../db/models';
import { ApiError } from '../utils/apiError';
import { hashPassword, comparePassword } from '../utils/password';

export class UserService {
  static async getProfile(userId: number) {
    const user = await User.findByPk(userId, {
      include: [{ model: Role, as: 'role' }],
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  }

  static async updateProfile(userId: number, data: { name?: string; phone?: string; address?: string; lat?: number; lng?: number }) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    await user.update(data);
    return user;
  }

  static async updateAvatar(userId: number, avatarUrl: string) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    await user.update({ avatar: avatarUrl });
    return user;
  }

  static async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await User.scope('withPassword').findByPk(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) {
      throw ApiError.badRequest('Current password is incorrect');
    }

    const hashedPassword = await hashPassword(newPassword);
    await user.update({ password: hashedPassword });
    return { message: 'Password updated successfully' };
  }
}
