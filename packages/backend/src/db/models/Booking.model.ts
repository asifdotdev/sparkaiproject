import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/database';

interface BookingAttributes {
  id: number;
  userId: number;
  providerId: number | null;
  serviceId: number;
  status: 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  lat: number | null;
  lng: number | null;
  notes: string | null;
  totalPrice: number;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  cancelledBy: 'user' | 'provider' | 'admin' | null;
  cancelReason: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface BookingCreationAttributes
  extends Optional<
    BookingAttributes,
    | 'id'
    | 'providerId'
    | 'status'
    | 'lat'
    | 'lng'
    | 'notes'
    | 'paymentStatus'
    | 'cancelledBy'
    | 'cancelReason'
    | 'startedAt'
    | 'completedAt'
  > {}

class Booking extends Model<BookingAttributes, BookingCreationAttributes> implements BookingAttributes {
  public id!: number;
  public userId!: number;
  public providerId!: number | null;
  public serviceId!: number;
  public status!: 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
  public scheduledDate!: string;
  public scheduledTime!: string;
  public address!: string;
  public lat!: number | null;
  public lng!: number | null;
  public notes!: string | null;
  public totalPrice!: number;
  public paymentStatus!: 'pending' | 'paid' | 'refunded' | 'failed';
  public cancelledBy!: 'user' | 'provider' | 'admin' | null;
  public cancelReason!: string | null;
  public startedAt!: Date | null;
  public completedAt!: Date | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Booking.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'user_id',
    },
    providerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'provider_id',
    },
    serviceId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'service_id',
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
    },
    scheduledDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      field: 'scheduled_date',
    },
    scheduledTime: {
      type: DataTypes.TIME,
      allowNull: false,
      field: 'scheduled_time',
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    lat: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    lng: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_price',
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'refunded', 'failed'),
      allowNull: false,
      defaultValue: 'pending',
      field: 'payment_status',
    },
    cancelledBy: {
      type: DataTypes.ENUM('user', 'provider', 'admin'),
      allowNull: true,
      field: 'cancelled_by',
    },
    cancelReason: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'cancel_reason',
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'started_at',
    },
    completedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'completed_at',
    },
  },
  {
    sequelize,
    tableName: 'bookings',
    timestamps: true,
    underscored: true,
  },
);

export default Booking;
