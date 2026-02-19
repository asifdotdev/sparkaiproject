import Role from './Role.model';
import User from './User.model';
import Category from './Category.model';
import Service from './Service.model';
import ProviderProfile from './ProviderProfile.model';
import ProviderService from './ProviderService.model';
import Booking from './Booking.model';
import Review from './Review.model';
import Payment from './Payment.model';

// Role <-> User
Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

// User <-> ProviderProfile (1:1)
User.hasOne(ProviderProfile, { foreignKey: 'user_id', as: 'providerProfile' });
ProviderProfile.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Category <-> Service
Category.hasMany(Service, { foreignKey: 'category_id', as: 'services' });
Service.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

// ProviderProfile <-> Service (M:N through ProviderService)
ProviderProfile.belongsToMany(Service, {
  through: ProviderService,
  foreignKey: 'provider_id',
  otherKey: 'service_id',
  as: 'services',
});
Service.belongsToMany(ProviderProfile, {
  through: ProviderService,
  foreignKey: 'service_id',
  otherKey: 'provider_id',
  as: 'providers',
});

// User <-> Booking (as customer)
User.hasMany(Booking, { foreignKey: 'user_id', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'user_id', as: 'customer' });

// ProviderProfile <-> Booking
ProviderProfile.hasMany(Booking, { foreignKey: 'provider_id', as: 'bookings' });
Booking.belongsTo(ProviderProfile, { foreignKey: 'provider_id', as: 'provider' });

// Service <-> Booking
Service.hasMany(Booking, { foreignKey: 'service_id', as: 'bookings' });
Booking.belongsTo(Service, { foreignKey: 'service_id', as: 'service' });

// Booking <-> Review (1:1)
Booking.hasOne(Review, { foreignKey: 'booking_id', as: 'review' });
Review.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });

// Booking <-> Payment
Booking.hasOne(Payment, { foreignKey: 'booking_id', as: 'payment' });
Payment.belongsTo(Booking, { foreignKey: 'booking_id', as: 'booking' });

// User <-> Review (as author)
User.hasMany(Review, { foreignKey: 'user_id', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// ProviderProfile <-> Review (as subject)
ProviderProfile.hasMany(Review, { foreignKey: 'provider_id', as: 'reviews' });
Review.belongsTo(ProviderProfile, { foreignKey: 'provider_id', as: 'provider' });

export { Role, User, Category, Service, ProviderProfile, ProviderService, Booking, Review, Payment };
