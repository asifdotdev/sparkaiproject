import { sequelize } from '../../config/database';
import { Role, User, Category, Service, ProviderProfile, ProviderService } from '../models';
import { hashPassword } from '../../utils/password';

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Connected. Syncing models...');
    await sequelize.sync({ force: true });
    console.log('Models synced. Seeding data...');

    // Seed Roles
    const roles = await Role.bulkCreate([
      { name: 'user', description: 'Regular customer who books services' },
      { name: 'provider', description: 'Service provider who fulfills bookings' },
      { name: 'admin', description: 'Administrator with full system access' },
    ]);
    console.log('Roles seeded');

    const userRole = roles[0];
    const providerRole = roles[1];
    const adminRole = roles[2];

    // Seed Users
    const hashedPassword = await hashPassword('password123');

    const admin = await User.scope('withPassword').create({
      roleId: adminRole.id,
      name: 'Admin User',
      email: 'admin@sparkai.com',
      phone: '1234567890',
      password: hashedPassword,
      isActive: true,
    });

    const user1 = await User.scope('withPassword').create({
      roleId: userRole.id,
      name: 'John Doe',
      email: 'user@sparkai.com',
      phone: '1234567891',
      password: hashedPassword,
      address: '123 Main Street, Downtown',
      lat: 24.7136,
      lng: 46.6753,
      isActive: true,
    });

    const user2 = await User.scope('withPassword').create({
      roleId: userRole.id,
      name: 'Jane Smith',
      email: 'jane@sparkai.com',
      phone: '1234567892',
      password: hashedPassword,
      address: '456 Oak Avenue',
      isActive: true,
    });

    const provider1User = await User.scope('withPassword').create({
      roleId: providerRole.id,
      name: 'Mike Provider',
      email: 'provider@sparkai.com',
      phone: '1234567893',
      password: hashedPassword,
      address: '789 Service Lane',
      isActive: true,
    });

    const provider2User = await User.scope('withPassword').create({
      roleId: providerRole.id,
      name: 'Sarah Provider',
      email: 'sarah.provider@sparkai.com',
      phone: '1234567894',
      password: hashedPassword,
      address: '321 Worker Street',
      isActive: true,
    });

    console.log('Users seeded');

    // Seed Categories
    const categories = await Category.bulkCreate([
      {
        name: 'Home Cleaning',
        description: 'Professional home cleaning services',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
        sortOrder: 1,
        isActive: true,
      },
      {
        name: 'Plumbing',
        description: 'Expert plumbing repair and installation',
        image: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400',
        sortOrder: 2,
        isActive: true,
      },
      {
        name: 'Electrical',
        description: 'Electrical repair and installation services',
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400',
        sortOrder: 3,
        isActive: true,
      },
      {
        name: 'Painting',
        description: 'Interior and exterior painting services',
        image: 'https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=400',
        sortOrder: 4,
        isActive: true,
      },
      {
        name: 'AC Repair',
        description: 'Air conditioning repair and maintenance',
        image: 'https://images.unsplash.com/photo-1631545806609-35d4ae440431?w=400',
        sortOrder: 5,
        isActive: true,
      },
      {
        name: 'Carpentry',
        description: 'Custom carpentry and furniture repair',
        image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400',
        sortOrder: 6,
        isActive: true,
      },
    ]);
    console.log('Categories seeded');

    // Seed Services
    const services = await Service.bulkCreate([
      // Home Cleaning
      { categoryId: categories[0].id, name: 'Full Home Deep Cleaning', description: 'Complete deep cleaning of your entire home including kitchen, bathrooms, and living areas', price: 150.00, durationMinutes: 180, isActive: true },
      { categoryId: categories[0].id, name: 'Kitchen Cleaning', description: 'Thorough kitchen cleaning including appliances, countertops, and floors', price: 60.00, durationMinutes: 90, isActive: true },
      { categoryId: categories[0].id, name: 'Bathroom Cleaning', description: 'Deep cleaning of bathrooms including tiles, fixtures, and sanitization', price: 45.00, durationMinutes: 60, isActive: true },
      // Plumbing
      { categoryId: categories[1].id, name: 'Pipe Leak Repair', description: 'Fix leaking pipes and faucets', price: 80.00, durationMinutes: 60, isActive: true },
      { categoryId: categories[1].id, name: 'Drain Cleaning', description: 'Unclog and clean blocked drains', price: 65.00, durationMinutes: 45, isActive: true },
      { categoryId: categories[1].id, name: 'Water Heater Installation', description: 'Install or replace water heater units', price: 200.00, durationMinutes: 120, isActive: true },
      // Electrical
      { categoryId: categories[2].id, name: 'Wiring Repair', description: 'Fix electrical wiring issues and short circuits', price: 100.00, durationMinutes: 90, isActive: true },
      { categoryId: categories[2].id, name: 'Light Fixture Installation', description: 'Install ceiling lights, chandeliers, and wall fixtures', price: 55.00, durationMinutes: 45, isActive: true },
      { categoryId: categories[2].id, name: 'Switch & Socket Repair', description: 'Replace or repair electrical switches and power sockets', price: 35.00, durationMinutes: 30, isActive: true },
      // Painting
      { categoryId: categories[3].id, name: 'Room Painting', description: 'Professional painting for a single room', price: 250.00, durationMinutes: 240, isActive: true },
      { categoryId: categories[3].id, name: 'Wall Touch-Up', description: 'Touch up paint on damaged or faded walls', price: 75.00, durationMinutes: 60, isActive: true },
      // AC Repair
      { categoryId: categories[4].id, name: 'AC Servicing', description: 'Complete AC service including filter cleaning and gas check', price: 70.00, durationMinutes: 60, isActive: true },
      { categoryId: categories[4].id, name: 'AC Installation', description: 'Professional installation of split or window AC units', price: 180.00, durationMinutes: 120, isActive: true },
      // Carpentry
      { categoryId: categories[5].id, name: 'Furniture Assembly', description: 'Assemble flat-pack furniture and fixtures', price: 60.00, durationMinutes: 90, isActive: true },
      { categoryId: categories[5].id, name: 'Door Repair', description: 'Fix or replace damaged doors and door frames', price: 90.00, durationMinutes: 60, isActive: true },
    ]);
    console.log('Services seeded');

    // Seed Provider Profiles
    const provider1 = await ProviderProfile.create({
      userId: provider1User.id,
      bio: 'Experienced home service professional with 8 years in the industry. Specializing in cleaning and plumbing.',
      experienceYears: 8,
      rating: 4.5,
      totalJobs: 156,
      isAvailable: true,
      verified: true,
    });

    const provider2 = await ProviderProfile.create({
      userId: provider2User.id,
      bio: 'Certified electrician and AC technician. Quality work guaranteed.',
      experienceYears: 5,
      rating: 4.8,
      totalJobs: 89,
      isAvailable: true,
      verified: true,
    });
    console.log('Provider profiles seeded');

    // Seed Provider Services
    await ProviderService.bulkCreate([
      { providerId: provider1.id, serviceId: services[0].id },
      { providerId: provider1.id, serviceId: services[1].id },
      { providerId: provider1.id, serviceId: services[2].id },
      { providerId: provider1.id, serviceId: services[3].id },
      { providerId: provider1.id, serviceId: services[4].id },
      { providerId: provider2.id, serviceId: services[6].id },
      { providerId: provider2.id, serviceId: services[7].id },
      { providerId: provider2.id, serviceId: services[8].id },
      { providerId: provider2.id, serviceId: services[11].id },
      { providerId: provider2.id, serviceId: services[12].id },
    ]);
    console.log('Provider services seeded');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSample credentials:');
    console.log('  Admin:    admin@sparkai.com / password123');
    console.log('  User:     user@sparkai.com / password123');
    console.log('  Provider: provider@sparkai.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
