import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

interface ServiceAttributes {
  id: number;
  categoryId: number;
  name: string;
  description: string | null;
  price: number;
  durationMinutes: number;
  image: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ServiceCreationAttributes
  extends Optional<ServiceAttributes, 'id' | 'description' | 'image' | 'isActive' | 'durationMinutes'> {}

class Service extends Model<ServiceAttributes, ServiceCreationAttributes> implements ServiceAttributes {
  public id!: number;
  public categoryId!: number;
  public name!: string;
  public description!: string | null;
  public price!: number;
  public durationMinutes!: number;
  public image!: string | null;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Service.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    categoryId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'category_id',
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    durationMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 60,
      field: 'duration_minutes',
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    tableName: 'services',
    timestamps: true,
    underscored: true,
  },
);

export default Service;
