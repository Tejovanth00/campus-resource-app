// Tej + Padhu - Booking routes
import express, { Response } from 'express';
import Booking from '../models/Booking';
import { protect } from '../middleware/auth';
import { adminOnly } from '../middleware/admin';
import { AuthRequest } from '../middleware/auth';
import upload from '../middleware/upload';
import { createBooking } from '../controllers/bookingController';
import { getMyBookings } from '../controllers/bookingController';
import { getAllBookings } from '../controllers/bookingController';
import { getBookingsByResource } from '../controllers/bookingController';
import { returnApprovalBasedResource } from '../controllers/bookingController';
import Resource from '../models/Resource';

const router = express.Router();

//PATCH /api/bookings/return - return an approval-based resource (must be before /:id route)
router.patch('/return', protect, returnApprovalBasedResource);

//PATCH /api/bookings/:id/status - Admin approve or reject a booking
router.patch('/:id/status', protect, adminOnly, async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      res.status(400).json({ message: 'Invalid status' });
      return;
    }

    const existingBooking = await Booking.findById(req.params.id).populate('resourceId');
    if (!existingBooking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    const resourceId = existingBooking.resourceId._id || existingBooking.resourceId;

    // If approved → mark resource as checked out
    if (status === 'approved') {
      await Resource.findByIdAndUpdate(resourceId, {
        available: false,
        checkedOutBy: existingBooking.userId,
        checkedOutAt: new Date(),
      });
    }

    // If rejected AND it was previously approved → free up the resource
    if (status === 'rejected' && existingBooking.status === 'approved') {
      await Resource.findByIdAndUpdate(resourceId, {
        available: true,
        checkedOutBy: null,
        checkedOutAt: null,
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('resourceId').populate('userId', 'name email');

    res.status(200).json({ message: `Booking ${status}`, booking });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

//GET /api/bookings/pending-count - Get count of pending bookings(admin only)
router.get('/pending-count',protect, adminOnly, async(req: AuthRequest, res: Response) => {
    try{
        const count = await Booking.countDocuments({status: 'pending'});
        res.status(200).json({ count });
    }catch(error){
        res.status(500).json({message: 'Server error'});
    }
});

// GET /api/bookings/stats - Get booking stats for current user
router.get('/stats', protect, async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const totalBookings = await Booking.countDocuments({ userId });
        const pendingBookings = await Booking.countDocuments({ userId, status: 'pending' });
        const approvedBookings = await Booking.countDocuments({ userId, status: 'approved' });

        res.status(200).json({
            totalBookings,
            pendingBookings,
            approvedBookings,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/bookings - Create a new booking
router.post('/', protect, upload.single('approvalImageUrl'), createBooking);
// GET /api/bookings/my - get current user's bookings
router.get('/my', protect, getMyBookings);
// GET /api/bookings/all - get all bookings (admin only)
router.get('/all', protect, adminOnly, getAllBookings);
// GET /api/bookings/resource - get bookings by resource and date
router.get('/resource', protect, getBookingsByResource);

export default router;