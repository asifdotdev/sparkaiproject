import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

interface ReviewAttributes {
  id: number;
  bookingId: number;
  userId: number;
  providerId: number;
  rating: number;
  comment: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ReviewCreationAttributes extends Optional<ReviewAttributes, 'id' | 'comment'> {}

class Review extends Model<ReviewAttributes, ReviewCreationAttributes> implements ReviewAttributes {
  public id!: number;
  public bookingId!: number;
  public userId!: number;
  public providerId!: number;
  public rating!: number;
  public comment!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Review.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    bookingId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
      field: 'booking_id',
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
    },
    providerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'provider_id',
    },
    rating: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'reviews',
    timestamps: true,
    underscored: true,
  },
);

export default Review;
