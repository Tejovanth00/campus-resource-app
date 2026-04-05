// Tej + Padhu - Booking routes
import express, { Response } from 'express';
import Booking from '../models/Booking';
import { protect } from '../middleware/auth';
import { adminOnly } from '../middleware/admin';
import { AuthRequest } from '../middleware/auth';
import upload from '../middleware/upload';
import { createBooking } from '../controllers/bookingController';

const router = express.Router();

//PATCH /api/bookings/:id/status - Admin approve or reject a booking
router.patch('/:id/status',protect, adminOnly, async(req: AuthRequest, res: Response) => {
    try{
        const { status } = req.body;

        if(!['approved','rejected'].includes(status)){
            res.status(400).json({message: 'Invalid status'});
            return;
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            {status},
            {new:true}
        );

        if(!booking){
            res.status(404).json({message: 'Booking not found'});
            return;
        }

        res.status(200).json({message: `Booking ${status}`, booking});

    }catch(error){
        res.status(500).json({message: 'Server error'});
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

// POST /api/bookings - Create a new booking
router.post('/', protect, upload.single('approvalImageUrl'), createBooking);

export default router;