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
  {
    name: 'Projector 1',
    category: 'projector',
    available: true,
  },
  {
    name: 'Basketball Court',
    category: 'sports',
    available: true,
  },
  {
    name: 'Hostel Common Room',
    category: 'hostel',
    available: true,
  },
  {
    name: 'Seminar Hall A',
    category: 'hostel',
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

    for (const resource of resources) {
      await Resource.findOneAndUpdate(
        { name: resource.name },
        { $set: resource },
        { upsert: true, new: true }
      );
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
