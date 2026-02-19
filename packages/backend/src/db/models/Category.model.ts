import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

interface CategoryAttributes {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, 'id' | 'description' | 'image' | 'sortOrder' | 'isActive'> {}

class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public image!: string | null;
  public sortOrder!: number;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    sortOrder: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'sort_order',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active',
    },
  },
  {
    sequelize,
    tableName: 'categories',
    timestamps: true,
    underscored: true,
  },
);

export default Category;
