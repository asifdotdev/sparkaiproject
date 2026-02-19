import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

interface ProviderServiceAttributes {
  id: number;
  providerId: number;
  serviceId: number;
  customPrice: number | null;
  createdAt?: Date;
}

interface ProviderServiceCreationAttributes
  extends Optional<ProviderServiceAttributes, 'id' | 'customPrice'> {}

class ProviderService
  extends Model<ProviderServiceAttributes, ProviderServiceCreationAttributes>
  implements ProviderServiceAttributes
{
  public id!: number;
  public providerId!: number;
  public serviceId!: number;
  public customPrice!: number | null;
  public readonly createdAt!: Date;
}

ProviderService.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    providerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'provider_id',
    },
    serviceId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'service_id',
    },
    customPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: 'custom_price',
    },
  },
  {
    sequelize,
    tableName: 'provider_services',
    timestamps: true,
    updatedAt: false,
    underscored: true,
  },
);

export default ProviderService;
