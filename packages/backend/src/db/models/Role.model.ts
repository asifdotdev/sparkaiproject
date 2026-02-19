import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

interface RoleAttributes {
  id: number;
  name: string;
  description: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RoleCreationAttributes extends Optional<RoleAttributes, 'id' | 'description'> {}

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: number;
  public name!: string;
  public description!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'roles',
    timestamps: true,
    underscored: true,
  },
);

export default Role;
