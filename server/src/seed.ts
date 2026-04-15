import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Resource from './models/Resource';
import User from './models/User';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('Missing MONGO_URI in .env');
  process.exit(1);
}

const resources = [
  // Equipment category
  {
    name: 'Projector 1',
    category: 'equipment',
    available: true,
  },
  {
    name: 'Projector 2',
    category: 'equipment',
    available: true,
  },
  {
    name: 'Lecture Hall A',
    category: 'equipment',
    available: true,
  },
  {
    name: 'Lecture Hall B',
    category: 'equipment',
    available: true,
  },
  {
    name: 'Computer Lab 1',
    category: 'equipment',
    available: true,
  },
  {
    name: 'Computer Lab 2',
    category: 'equipment',
    available: true,
  },
  // Approval-based category
  {
    name: 'Auditorium',
    category: 'approval-based',
    available: true,
  },
  {
    name: 'Seminar Hall A',
    category: 'approval-based',
    available: true,
  },
  {
    name: 'Seminar Hall B',
    category: 'approval-based',
    available: true,
  },
  // Recreational category
  {
    name: 'Carrom Board',
    category: 'recreational',
    available: true,
  },
  {
    name: 'Chess Set',
    category: 'recreational',
    available: true,
  },
  {
    name: 'Shuttle Bat Set',
    category: 'recreational',
    available: true,
  },
];

const users = [
  {
    name: 'Demo Admin',
    email: 'admin@demo.com',
    password: 'Admin123',
    role: 'admin',
    userType: 'faculty',
  },
  {
    name: 'Demo User',
    email: 'user@demo.com',
    password: 'User123',
    role: 'user',
    userType: 'classrep',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI as string);
    console.log('MongoDB connected for seeding');

    // Clear existing resources
    await Resource.deleteMany({});
    console.log('Cleared existing resources');

    for (const resource of resources) {
      await Resource.create(resource);
    }

    for (const user of users) {
      const existingUser = await User.findOne({ email: user.email });
      if (!existingUser) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await User.create({
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          userType: user.userType,
        });
      }
    }

    console.log('Seed complete');
    console.log('Demo admin: admin@demo.com / Admin123');
    console.log('Demo user: user@demo.com / User123');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
