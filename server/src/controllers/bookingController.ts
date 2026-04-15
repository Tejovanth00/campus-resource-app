import { Request, Response } from 'express';
import Booking from '../models/Booking';
import { AuthRequest } from '../middleware/auth';

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { resourceId, date, timeSlot, purpose } = req.body;

    // check all required fields exist
    if (!resourceId || !date || !timeSlot || !purpose) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    // check image was uploaded
    if (!req.file) {
      res.status(400).json({ message: 'Approval image is required' });
      return;
    }

    const booking = await Booking.create({
      userId: req.user?.userId,
      resourceId,
      date,
      timeSlot,
      purpose,
      approvalImageUrl: req.file.path,
      status: 'pending',
    });

    res.status(201).json({ message: 'Booking created successfully', booking });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find({ userId: req.user?.userId })
      .populate('resourceId', 'name category')
      .sort({ createdAt: -1 });

    if (!bookings.length) {
      res.status(404).json({ message: 'No bookings found' });
      return;
    }

    res.status(200).json({ bookings });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllBookings = async (req: AuthRequest, res: Response) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email userType')
      .populate('resourceId', 'name category')
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBookingsByResource = async (req: AuthRequest, res: Response) => {
  try {
    const { resourceId, date } = req.query;

    if (!resourceId || !date) {
      res.status(400).json({ message: 'resourceId and date are required' });
      return;
    }

    const bookings = await Booking.find({
      resourceId,
      date: new Date(date as string),
      status: 'approved'
    }).select('timeSlot purpose userId');

    res.status(200).json({ bookings });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
