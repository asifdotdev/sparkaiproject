import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/database';

class Notification extends Model {
  declare id: number;
  declare userId: number;
  declare title: string;
  declare body: string;
  declare type: string;
  declare referenceId: number | null;
  declare isRead: boolean;
  declare createdAt: Date;
}

Notification.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    userId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, field: 'user_id' },
    title: { type: DataTypes.STRING(200), allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    type: {
      type: DataTypes.ENUM('booking_created', 'booking_accepted', 'booking_rejected', 'booking_started', 'booking_completed', 'booking_cancelled', 'payment_received', 'review_received', 'general'),
      allowNull: false,
      defaultValue: 'general',
    },
    referenceId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, field: 'reference_id' },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false, field: 'is_read' },
  },
  {
    sequelize,
    tableName: 'notifications',
    underscored: true,
    timestamps: true,
    updatedAt: false,
  },
);

export default Notification;
