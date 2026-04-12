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
