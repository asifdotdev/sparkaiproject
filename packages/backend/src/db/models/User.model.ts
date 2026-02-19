import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

interface UserAttributes {
  id: number;
  roleId: number;
  name: string;
  email: string;
  phone: string | null;
  password: string;
  avatar: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  isActive: boolean;
  emailVerifiedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'phone' | 'avatar' | 'address' | 'lat' | 'lng' | 'isActive' | 'emailVerifiedAt'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public roleId!: number;
  public name!: string;
  public email!: string;
  public phone!: string | null;
  public password!: string;
  public avatar!: string | null;
  public address!: string | null;
  public lat!: number | null;
  public lng!: number | null;
  public isActive!: boolean;
  public emailVerifiedAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'role_id',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    lat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    lng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
    emailVerifiedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'email_verified_at',
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] },
      },
    },
  },
);

export default User;
