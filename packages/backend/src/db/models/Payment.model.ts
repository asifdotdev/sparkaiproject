import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

interface PaymentAttributes {
  id: number;
  bookingId: number;
  amount: number;
  method: 'card' | 'upi' | 'wallet' | 'cash' | 'net_banking';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  transactionId: string | null;
  paidAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface PaymentCreationAttributes
  extends Optional<PaymentAttributes, 'id' | 'method' | 'status' | 'transactionId' | 'paidAt'> {}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: number;
  public bookingId!: number;
  public amount!: number;
  public method!: 'card' | 'upi' | 'wallet' | 'cash' | 'net_banking';
  public status!: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  public transactionId!: string | null;
  public paidAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    bookingId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'booking_id',
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    method: {
      type: DataTypes.ENUM('card', 'upi', 'wallet', 'cash', 'net_banking'),
      allowNull: false,
      defaultValue: 'cash',
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed', 'refunded'),
      allowNull: false,
      defaultValue: 'pending',
    },
    transactionId: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'transaction_id',
    },
    paidAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'paid_at',
    },
  },
  {
    sequelize,
    tableName: 'payments',
    timestamps: true,
    underscored: true,
  },
);

export default Payment;
