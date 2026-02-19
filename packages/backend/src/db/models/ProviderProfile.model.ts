import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

interface ProviderProfileAttributes {
  id: number;
  userId: number;
  bio: string | null;
  experienceYears: number;
  rating: number;
  totalJobs: number;
  isAvailable: boolean;
  verified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProviderProfileCreationAttributes
  extends Optional<
    ProviderProfileAttributes,
    'id' | 'bio' | 'experienceYears' | 'rating' | 'totalJobs' | 'isAvailable' | 'verified'
  > {}

class ProviderProfile
  extends Model<ProviderProfileAttributes, ProviderProfileCreationAttributes>
  implements ProviderProfileAttributes
{
  public id!: number;
  public userId!: number;
  public bio!: string | null;
  public experienceYears!: number;
  public rating!: number;
  public totalJobs!: number;
  public isAvailable!: boolean;
  public verified!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProviderProfile.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      unique: true,
      field: 'user_id',
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    experienceYears: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'experience_years',
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0.0,
    },
    totalJobs: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'total_jobs',
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_available',
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'provider_profiles',
    timestamps: true,
    underscored: true,
  },
);

export default ProviderProfile;
